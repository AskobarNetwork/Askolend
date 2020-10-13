const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");
const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");

module.exports = async deployer => {
  await deployer.deploy(
    MoneyMarketControl,
    UniswapOracleFactory.address,
    MoneyMarketFactory.address
  );
  UOF = await UniswapOracleFactory.deployed();
  await UOF.transferOwnership(MoneyMarketControl.address);
  MMC = await MoneyMarketControl.deployed();
  await MMC.whitelistAsset(
    "0xe41a91eFfD31bdda4e91C5FE076C9B53DD4024f9",
    "FakeAugur",
    "FAG"
  );
  await MMC.setUpAHR(
    10,
    10,
    10,
    50,
    3,
    20,
    "0xe41a91eFfD31bdda4e91C5FE076C9B53DD4024f9"
  );
  await MMC.setUpALR(
    20,
    20,
    20,
    50,
    3,
    20,
    "0xe41a91eFfD31bdda4e91C5FE076C9B53DD4024f9"
  );

  await MMC.whitelistAsset(
    "0x925875a558D6181788587d851ab3E653C09A0B06",
    "FakeLink",
    "FAL"
  );
  await MMC.setUpAHR(
    10,
    10,
    10,
    50,
    3,
    20,
    "0x925875a558D6181788587d851ab3E653C09A0B06"
  );
  await MMC.setUpALR(
    20,
    20,
    20,
    50,
    3,
    20,
    "0x925875a558D6181788587d851ab3E653C09A0B06"
  );
};
