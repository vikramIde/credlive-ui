
const txListener = require("../listeners/tx-listener");
const TransactionListener = require("../listeners/listener");
const { TX_QR_EVENT } = require("../events");
// const EventEmitter = require("events").EventEmitter;
const TSIController = require("./tsi-controller");
const HSDispatcher = require('../dispatcher/dispatcher.js')

const getAccounts = (cb, walletController) => {
    // debugger
    // TSIController.getAccounts().then(accounts => {
    //     cb(null, accounts)
    // }).catch(cb);
}

const signTransaction = (rawTx, cb) => {
    // debugger
    HSDispatcher.QREventGenerator(rawTx)

    //Create files similar to DBListener for other listeners.
    // Seperated in order to support more listeners like TSI SASS listener

    /// rawTx QR me shohw 
    /// websocket listener start
    /// QR ka popup show karo js wala 
    /// uske peeche me rawTx 
    
    /// scan hoga QR ans singned by Mobile 
    /// web socket will get the singeed message : digest
    /// cb(null, digest);
    
    // const listener = new TransactionListener(txListener);
    // listener.createTransaction(rawTx)
    //     .then(id => {
    //         TSIController.emit(TX_QR_EVENT, id);
    //         listener.start(id, cb);
    //     })
}

module.exports = {
    getAccounts,
    signTransaction
}