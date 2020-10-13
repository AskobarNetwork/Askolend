const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");

module.exports = function(deployer) {
  deployer.deploy(
    UniswapOracleFactory,
    "0x2e12BED1FDf9EeFB410619017C76569Cf9Bf1668",
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  );
};
