const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");

module.exports = function (deployer) {
  deployer.deploy(MoneyMarketFactory, "0x85De147b9042651c0e1f5cbb9531256Afac38732");
};
