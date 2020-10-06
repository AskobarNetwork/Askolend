const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");

module.exports = function (deployer) {
  deployer.deploy(MoneyMarketControl, "0x85De147b9042651c0e1f5cbb9531256Afac38732", MoneyMarketFactory.address);
};
