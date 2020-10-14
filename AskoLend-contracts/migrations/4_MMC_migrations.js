const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");
const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const FakeLink = artifacts.require("FakeLink");
const FakeAugur = artifacts.require("FakeAugur");

module.exports = async deployer => {
  await deployer.deploy(
    MoneyMarketControl,
    UniswapOracleFactory.address,
    MoneyMarketFactory.address
  );
  console.log("Money Market Control Deployed!");
  UOF = await UniswapOracleFactory.deployed();
  await UOF.transferOwnership(MoneyMarketControl.address);
  console.log(
    "Uniswap oracle contract factory ownership transfered to Money Market Control contract"
  );
  MMC = await MoneyMarketControl.deployed();
  console.log("Setting up FakeAugur Money Market Instance");
  await MMC.whitelistAsset(FakeAugur.address, "FakeAugur", "FAG");
  console.log("FakeAugur White Listed");
  await MMC.setUpAHR(
    5000000000000000,
    5000000000000000,
    5000000000000000,
    5000000000000000,
    3000000000000000,
    1000000000000000,
    FakeAugur.address
  );
  console.log("FakeAugur Asko High Risk Token Created");
  await MMC.setUpALR(
    3000000000000000,
    3000000000000000,
    2000000000000000,
    5000000000000000,
    3000000000000000,
    2000000000000000,
    FakeAugur.address
  );
  console.log("FakeAugur Asko Low Risk Token Created");
  console.log("Setting up FakeLink Money Market Instance");
  await MMC.whitelistAsset(FakeLink.address, "FakeLink", "FAL");
  console.log("FakeLink White Listed");
  await MMC.setUpAHR(
    5000000000000000,
    5000000000000000,
    5000000000000000,
    5000000000000000,
    3000000000000000,
    1000000000000000,
    FakeLink.address
  );
  console.log("FakeLink Asko High Risk Token Created");
  await MMC.setUpALR(
    5000000000000000,
    5000000000000000,
    5000000000000000,
    5000000000000000,
    3000000000000000,
    1000000000000000,
    FakeLink.address
  );
  console.log("FakeLink Asko Low Risk Token Created");
};
