const HDWalletProvider = require("truffle-hdwallet-provider");
const memonic = "tragic near rocket across biology shop push dragon jazz detail differ say";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 4600000
    },
    // rinkeby: {
    //   network_id: 4,
    //   host: "http://192.168.1.130",
    //   port: 8545,
    //   gas: 2900000,
    //   from: "0xa1138fccd5f8E126E8d779CF78a547517307559d"
    // },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(memonic, "http://192.168.1.130") //https://rinkeby.infura.io/
      },
      network_id: 3
    }
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.4.24",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};