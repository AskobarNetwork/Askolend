const FakeLink = artifacts.require("FakeLink");

module.exports = function(deployer) {
  deployer.deploy(FakeLink);
};
