var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "token multiply dog crouch toe genre until oblige risk hero salt hat";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      },
      network_id: '*',
      gas: 6500000
    }
  },
  compilers: {
    solc: {
      version: "^0.5.0"
    }
  }
};