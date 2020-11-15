const FakeAugur = artifacts.require("FakeAugur");

module.exports = function(deployer) {
  deployer.deploy(FakeAugur);
};
