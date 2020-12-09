const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const FakeUSDC = artifacts.require("FakeUSDC");
const FakeLink = artifacts.require("FakeLink");
const FakeAugur = artifacts.require("FakeAugur");
const FakeBAT = artifacts.require("FakeBAT");
const FakewBTC = artifacts.require("FakewBTC");
const FakewETH = artifacts.require("FakewETH");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const ARTFactory = artifacts.require("ARTFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");
const FakeFaucet = artifacts.require("FakeFaucet");

module.exports = async (deployer) => {
  const ownerAddress = "0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41";
  await deployer.deploy(FakeUSDC);
  await deployer.deploy(FakeLink);
  await deployer.deploy(FakeAugur);
  await deployer.deploy(FakeBAT);
  await deployer.deploy(FakewBTC);
  await deployer.deploy(FakewETH);
  await deployer.deploy(
    FakeFaucet,
    FakeLink.address,
    FakeAugur.address,
    FakeBAT.address,
    FakewBTC.address,
    FakewETH.address
  );

  const usdc = await FakeUSDC.deployed();
  const link = await FakeLink.deployed();
  const augur = await FakeAugur.deployed();
  const bat = await FakeBAT.deployed();
  const wbtc = await FakewBTC.deployed();
  const weth = await FakewETH.deployed();

  await link.transferOwnership(FakeFaucet.address);
  await augur.transferOwnership(FakeFaucet.address);
  await bat.transferOwnership(FakeFaucet.address);
  await wbtc.transferOwnership(FakeFaucet.address);
  await weth.transferOwnership(FakeFaucet.address);
  console.log("Faucet set to drip!");

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
  const pair1 = await UniswapV2Pair.at(USDC_AGR);
  pair1.sync();
  console.log("Listed USDC-AGR");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-LINK");
  await UNI.createPair(FakeUSDC.address, FakeLink.address);
  const USDC_Link = await UNI.getPair(FakeUSDC.address, FakeLink.address);
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
  const pair2 = await UniswapV2Pair.at(USDC_Link);
  pair2.sync();
  console.log("Listed USDC_FakeLink");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-wBTC");
  await UNI.createPair(FakeUSDC.address, FakewBTC.address);
  console.log("pair created");
  const USDC_wBTC = await UNI.getPair(FakeUSDC.address, FakewBTC.address);
  console.log("USDC-wBTC pair created");
  console.log(USDC_wBTC);
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await wbtc.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    wbtc.address,
    "16000000000000000000000", //$16000 USDC
    "1000000000000000000", // 1 wBTC
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair3 = await UniswapV2Pair.at(USDC_wBTC);
  pair3.sync();
  console.log("Listed USDC-wBTC");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-wETH");
  await UNI.createPair(FakeUSDC.address, FakewETH.address);
  const USDC_wETH = await UNI.getPair(FakeUSDC.address, FakewETH.address);
  console.log("USDC-wETH pair created");
  console.log(USDC_wETH);
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await weth.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    weth.address,
    "1800000000000000000000", //$1800 USDC
    "3000000000000000000", // 3wETH
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair4 = await UniswapV2Pair.at(USDC_wETH);
  pair4.sync();
  console.log("Listed USDC_wETH");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing USDC-BAT");
  await UNI.createPair(FakeUSDC.address, FakeBAT.address);
  const USDC_BAT = await UNI.getPair(FakeUSDC.address, FakeBAT.address);
  console.log("USDC-BAT pair created");
  console.log(USDC_BAT);
  await usdc.approve(UNI_R.address, "10000000000000000000000000000");
  await bat.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    usdc.address,
    bat.address,
    "100000000000000000000", //$100 USDC
    "422000000000000000000", // 422 BAT
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair5 = await UniswapV2Pair.at(USDC_BAT);
  pair5.sync();
  console.log("Listed USDC_BAT");
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
  ////////////////////////////////////////////////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////////////////////////////////////////

  console.log("Setting up FakewBTC Money Market Instance");
  await MMC.whitelistAsset(FakewBTC.address, "Wrapped Bitcoin", "wBTC");
  console.log("FakewBTC White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakewBTC.address
  );
  console.log("FakewBTC Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakewBTC.address
  );
  console.log("FakewBTC Asko Low Risk Token Created");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up FakewETH Money Market Instance");
  await MMC.whitelistAsset(FakewETH.address, "Wrapped Ethereum", "wETH");
  console.log("FakewETH White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakewETH.address
  );
  console.log("FakewETH Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakewETH.address
  );
  console.log("FakewETH Asko Low Risk Token Created");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up FakeBAT Money Market Instance");
  await MMC.whitelistAsset(FakeBAT.address, "Basic Attention Token", "BAT");
  console.log("FakeBAT White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakeBAT.address
  );
  console.log("FakeBAT Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    50, //fee this is the fee % value
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    FakeBAT.address
  );
  console.log("FakeBAT Asko Low Risk Token Created");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log(
    "Uniswap oracle factory address: " + UniswapOracleFactory.address
  );
  console.log("FakeUSDC address: " + FakeUSDC.address);
  console.log("FakeLink address: " + FakeLink.address);
  console.log("FakeAugur address: " + FakeAugur.address);
  console.log("FakeBAT address: " + FakeBAT.address);
  console.log("FakewBTC address: " + FakewBTC.address);
  console.log("FakewETH address: " + FakewETH.address);
  console.log("Fake Faucet address: " + FakeFaucet.address);
  console.log("Money Market Control: " + MoneyMarketControl.address);
  ////////////////////////////////////////////////////////////////////////////////////////////
};
