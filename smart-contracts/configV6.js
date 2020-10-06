module.exports = {
  defaultNetwork: "develop",

  networks: {
    develop: {
      gas: 6000000
    }
  },

  solc: {
    version: "0.6.2",
    optimizer: {
      enabled: true,
      runs: 200
    }
  },

  paths: {
    sources: "./contracts/v5",
  },
};
