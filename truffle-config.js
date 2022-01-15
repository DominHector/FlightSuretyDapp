var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "explain volcano unlock merry inspire tank panel dice reduce capable resist napkin";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      },
      network_id: '*',
      gas: 4600000
    }
  },
  compilers: {
    solc: {
      version: "^0.5.0"
    }
  }
};