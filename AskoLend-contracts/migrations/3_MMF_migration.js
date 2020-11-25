const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const ARTFactory = artifacts.require("ARTFactory");

module.exports = function (deployer) {
  deployer.deploy(MoneyMarketFactory);
  deployer.deploy(ARTFactory);
};
