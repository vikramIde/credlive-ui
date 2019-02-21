const database = require("../controllers/database-controller");

const SESSIONS = "Sessions", SIGNED_IN = "signed_in", TIMED_OUT = "timed-out", CREATED = "created";

const createTransaction = rawTx => (
    new Promise(resolve => {
        rawTx.status = CREATED;
        rawTx.accounts = [];
        database.collection(SESSIONS).add(rawTx)
        .then(({ id }) => {
            resolve(id);
        })
    })
)

const checkForStatusChange = (docId, cb) => {
    const unsubscribe = database.collection(SESSIONS).doc(docId).onSnapshot(session => {
        const sessionData = session.data();
        if (sessionData.status === SIGNED_IN) {
            timeout && clearTimeout(timeout);
            unsubscribe && unsubscribe();
            cb(null, true);
        }
    }, console.log);
    const timeout = setTimeout(() => {
        console.log("User did not log in after 2 minutes. Exiting listener...");
        markTransactionFailed(docId);
        unsubscribe && unsubscribe();
        cb(new Error("Transaction not accepted by user"), false);
    }, 120000);
}

const markTransactionFailed = id => {
    database.collection(SESSIONS).doc(id).set({
        status: TIMED_OUT
    }, { merge: true });      
}

module.exports = {
    createTransaction,
    checkForStatusChange,
    markTransactionFailed
}