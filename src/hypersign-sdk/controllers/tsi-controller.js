const database = require("./database-controller");
const loginListener = require("../listeners/login-listener");
const TransactionListener = require("../listeners/listener");
// const TSIEventEmitter = require("../events/tsi-eventemitter");
const EventEmitter = require("events").EventEmitter;
const { LOGIN_QR_EVENT } = require("../events");
const SESSION_ID_KEY = "session_id";
const SIGNED_IN = "signed_in", SESSIONS = "Sessions", CLOSE = "close", ERROR = "error";

class TSIController extends EventEmitter {

    constructor() {
        super();
        if (!TSIController.instance) {
            this.deleteAllCookies();
            this.sessionId = this.getCookie(SESSION_ID_KEY);
            // this.sessionId = "gdHBOIOnh96Tk4DjE9PJ";
        }
        return TSIController.instance;
    }

    init = () => {
        const p = this.getEmitterPromise()
        if (this.sessionId) {
            this.isLoggedIn()
                .then(loggedIn => {
                    if (!loggedIn) { 
                        this.sessionId = "";
                    } else {
                        this.initialized = true;
                    }
                    this.emit(CLOSE, { sessionId: this.sessionId, loggedIn })
                })
        } else {
            const session = {};
            const listener = new TransactionListener(loginListener);
            listener.createTransaction(session)
                .then(id => {
                    this.emit(LOGIN_QR_EVENT, id);
                    listener.start(id, (error, loggedIn) => {
                        if (error) {
                            this.emit(ERROR, error);
                        } else {
                            this.createCookie(SESSION_ID_KEY, id);
                            this.sessionId = id;
                            this.initialized = true;
                            this.emit(CLOSE, { sessionId: id, loggedIn });
                        }
                    });
                })
        }
        return p;
    }

    getEmitterPromise = () => {
        const p = new Promise((resolve, reject) => {
            this.once(CLOSE, resolve);
            this.once(ERROR, reject);
        });
        const self = this;
        p.on = function() {
            self.once.apply(self, arguments);
            return p;
        }
        return p;
    }

    isInitialized = () => this.initialized;

    isLoggedIn = () => (
        new Promise(resolve => {
            this.getData().then(data => {
                resolve(data.status === SIGNED_IN);
            })
        })
    )

    getData = () => (
        new Promise((resolve, reject) => {
            if (this.sessionId) {
                database.collection(SESSIONS).doc(this.sessionId).get()
                    .then(doc => {
                        resolve(doc.data());
                    })
            } else {
                reject(new Error("Session not initialized. Please initialize a login controller object before using it"));
            }
        })
    )

    getAccounts = () => (
        new Promise(resolve => {
            this.getData().then(({ accounts }) => resolve(accounts))
        })
    )

    createCookie = (name, value, days) => {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    getCookie = (c_name) => {
        c_name = c_name.toLowerCase();
        const cookie = document.cookie;
        if (cookie.length > 0) {
            let c_start = cookie.indexOf(c_name + "=");
            if (c_start !== -1) {
                c_start = c_start + c_name.length + 1;
                let c_end = cookie.indexOf(";", c_start);
                if (c_end === -1) {
                    c_end = cookie.length;
                }
                return unescape(cookie.substring(c_start, c_end));
            }
        }
        return "";
    }

    deleteAllCookies = () => {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
}

const instance = new TSIController();
// Object.freeze(instance);

module.exports = instance;