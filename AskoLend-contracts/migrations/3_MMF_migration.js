const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");

module.exports = function (deployer) {
  deployer.deploy(MoneyMarketFactory);
};
