const database = require("../controllers/database-controller");

const SIGNED = "signed", TRANSACTIONS = "Transactions", SIGN_REQUEST = "sign_request", TIMED_OUT = "timed-out";

const createTransaction = rawTx => (
    new Promise(resolve => {
        rawTx.status = SIGN_REQUEST;
        rawTx.signedTx = "";
        rawTx.value = rawTx.value || "0x0";
        database.collection(TRANSACTIONS).add(rawTx)
        .then(({ id }) => {
            resolve(id);
        })
    })
)

const checkForStatusChange = (docId, cb) => {
    const unsubscribe = database.collection(TRANSACTIONS).doc(docId).onSnapshot(transaction => {
        const transactionData = transaction.data();
        console.log("Transaction changed =>", transactionData);
        if (transactionData.status === SIGNED) {
            timeout && clearTimeout(timeout);
            unsubscribe && unsubscribe();
            cb(null, transactionData.signedTx);
        }
    }, console.log);
    const timeout = setTimeout(() => {
        console.log("Transaction not signed after 2 minutes. Exiting listener...");
        markTransactionFailed(docId);
        unsubscribe && unsubscribe();
        cb(new Error("Transaction not accepted by user"));
    }, 120000);
}

const markTransactionFailed = id => {
    database.collection(TRANSACTIONS).doc(id).set({
        status: TIMED_OUT
    }, { merge: true });      
}

module.exports = {
    createTransaction,
    checkForStatusChange,
    markTransactionFailed
}