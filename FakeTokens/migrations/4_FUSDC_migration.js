const FakeUSDC = artifacts.require("FakeUSDC");

module.exports = function(deployer) {
  deployer.deploy(FakeUSDC);
};
