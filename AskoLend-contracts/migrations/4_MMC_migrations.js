const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");
const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");

module.exports = async (deployer) => {
  await deployer.deploy(MoneyMarketControl, UniswapOracleFactory.address ,MoneyMarketFactory.address);
    UOF = await UniswapOracleFactory.deployed();
    await UOF.transferOwnership(MoneyMarketControl.address);
    MMC = await MoneyMarketControl.deployed();
    await MMC.whitelistAsset("0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd", "Maker", "MKR");
    await MMC.setUpAHR(1,1,1,50,3,100000000, "0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd");
    await MMC.setUpALR(2,2,2,50,3,200000000, "0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd");



};
