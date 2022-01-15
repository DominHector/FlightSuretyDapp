var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "veteran tape manage illness blouse squirrel obtain spot drill dwarf dove drip";

module.exports = {
  networks: {
    development: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      },
      network_id: '*',
      gas: 4599999
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};