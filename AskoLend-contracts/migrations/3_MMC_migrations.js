const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");

module.exports = function (deployer) {
  deployer.deploy(MoneyMarketControl, MoneyMarketFactory.address, "0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41 ");
};
