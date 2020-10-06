module.exports = {
  defaultNetwork: "develop",

  networks: {
    develop: {
      gas: 6000000
    }
  },

  solc: {
    version: "0.5.16",
    optimizer: {
      enabled: true,
      runs: 200
    }
  },

  paths: {
    sources: "./contracts/compound",
  },
};
