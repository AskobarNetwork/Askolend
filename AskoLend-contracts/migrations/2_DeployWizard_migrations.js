const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const FakeUSDC = artifacts.require("FakeUSDC");
const FakeLink = artifacts.require("FakeLink");
const FakeAugur = artifacts.require("FakeAugur");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const ARTFactory = artifacts.require("ARTFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");

module.exports = async (deployer) => {
  const ownerAddress = "0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41";
  await deployer.deploy(FakeUSDC);
  await deployer.deploy(FakeLink);
  await deployer.deploy(FakeAugur);

  const usdc = await FakeUSDC.deployed();
  const link = await FakeLink.deployed();
  const augur = await FakeAugur.deployed();
  await deployer.deploy(
    UniswapV2Factory,
    "0xEAf8DaEfE55Fa2268775a06B43847a7f48D98720"
  );
  console.log("UniSwap Deployed");
  console.log("Deploying the UniSwap Router...");
  await deployer.deploy(
    UniswapV2Router02,
    UniswapV2Factory.address,
    FakeUSDC.address
  );
  console.log("UniSwap Router Deployed");
  const UNI = await UniswapV2Factory.deployed();
  const UNI_R = await UniswapV2Router02.deployed();
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-AGR");
  await UNI.createPair(FakeUSDC.address, FakeAugur.address);
  console.log("pair created");
  const USDC_AGR = await UNI.getPair(FakeUSDC.address, FakeAugur.address);
  console.log("USDC-AGR pair created");
  console.log(USDC_AGR);
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await augur.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    augur.address,
    "600000000000000000000", //$600 USDC
    "30000000000000000000", // 30 augur
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair2 = await UniswapV2Pair.at(USDC_AGR);
  pair2.sync();
  console.log("Listed USDC-AGR");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-LINK");
  await UNI.createPair(usdc.address, link.address);
  const USDC_Link = await UNI.getPair(usdc.address, link.address);
  console.log("USDC-FakeLink pair created");
  console.log(USDC_Link);
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await link.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    link.address,
    "400000000000000000000", //$400 USDC
    "40000000000000000000", // 40 link
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair1 = await UniswapV2Pair.at(USDC_Link);
  pair1.sync();
  console.log("Listed USDC_FakeLink");
  ////////////////////////////////////////////////////////////////////////////////////////////
  await deployer.deploy(
    UniswapOracleFactory,
    FakeUSDC.address,
    UniswapV2Factory.address,
    UNI_R.address
  );
  console.log("Oracle Factory Deployed");
  ////////////////////////////////////////////////////////////////////////////////////////////
  await deployer.deploy(MoneyMarketFactory);
  console.log("Money Market Factory Deployed");
  await deployer.deploy(ARTFactory);
  console.log("ART Factory Deployed");
  ////////////////////////////////////////////////////////////////////////////////////////////
  await deployer.deploy(
    MoneyMarketControl,
    UniswapOracleFactory.address,
    MoneyMarketFactory.address,
    ARTFactory.address
  );
  console.log("Money Market Control Deployed!");
  UOF = await UniswapOracleFactory.deployed();
  await UOF.transferOwnership(MoneyMarketControl.address);
  console.log(
    "Uniswap oracle contract factory ownership transfered to Money Market Control contract"
  );
  MMC = await MoneyMarketControl.deployed();
  console.log("Setting up FakeAugur Money Market Instance");
  await MMC.whitelistAsset(FakeAugur.address, "Augur", "AGR");
  console.log("FakeAugur White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakeAugur.address //asset address
  );
  console.log("FakeAugur Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakeAugur.address
  );
  console.log("FakeAugur Asko Low Risk Token Created");
  console.log("Setting up FakeLink Money Market Instance");
  await MMC.whitelistAsset(FakeLink.address, "Link", "LINK");
  console.log("FakeLink White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakeLink.address
  );
  console.log("FakeLink Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakeLink.address
  );
  console.log("FakeLink Asko Low Risk Token Created");

  console.log(
    "Uniswap oracle factory address: " + UniswapOracleFactory.address
  );
  console.log("FakeUSDC address: " + FakeUSDC.address);
  console.log("FakeLink address: " + FakeLink.address);
  console.log("FakeAugur address: " + FakeAugur.address);
  console.log("Money Market Control: " + MoneyMarketControl.address);
};
