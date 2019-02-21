require('babel-register');
require('babel-polyfill');

var HDWalletProvider = require("truffle-hdwallet-provider");
var infura_apikey = "55094ac1f57f4ffaa2be7fc764a14d15";
var mnemonic = "traffic bracket depth radar labor double knock ritual ozone ball crisp dune";
var testRpcMnemonic = "civil silk monster coffee access vast peasant village under pretty trade resource"

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      // from: "0xb359705e8d34ed0a8ee0f28e733ebc5e6490c515",
      from: "0x5964E97B04bfbA5dFD62Bf0E1fED5e54D9B7C54e",
      network_id : "*"
    },
    prod: {
      host: "52.66.155.129",
      port: 8545,
      from: "0x5964E97B04bfbA5dFD62Bf0E1fED5e54D9B7C54e",
      network_id : "3257"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey);
      },
      network_id: '3',
      gas:4612388,
    }
  }
};
