const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");

module.exports = function (deployer) {
  deployer.deploy(UniswapOracleFactory, "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa", "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");
};
