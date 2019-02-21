const { EventEmitter } = require("events");

class TransactionListener extends EventEmitter {

    constructor(opts) {
        super(opts);
        this.createTransaction = (this.isValid(opts.createTransaction) && opts.createTransaction.bind(this)) || this.mustProvideInConstructor("createTransaction");
        this.checkForStatusChange = (this.isValid(opts.checkForStatusChange) && opts.checkForStatusChange.bind(this)) || this.mustProvideInConstructor("checkForStatusChange")
    }

    start = (id, cb) => {
        this.checkForStatusChange(id, cb)
    }

    mustProvideInConstructor = (methodName) => {
        return () => {
          throw(new Error('ProviderEngine - HookedWalletSubprovider - Must provide "' + methodName + '" fn in constructor options'))
        }
    }

    isValid = method => method && typeof method === "function"
}

module.exports = TransactionListener