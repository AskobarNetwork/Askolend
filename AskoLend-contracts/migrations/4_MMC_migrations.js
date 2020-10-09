const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");
const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");

module.exports = function (deployer) {
  deployer.deploy(MoneyMarketControl, UniswapOracleFactory.address ,MoneyMarketFactory.address);
};
