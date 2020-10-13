const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const FakeUSDC = artifacts.require("FakeUSDC");

module.exports = function(deployer) {
  deployer.deploy(
    UniswapOracleFactory,
    FakeUSDC.address,
    "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
  );
};
