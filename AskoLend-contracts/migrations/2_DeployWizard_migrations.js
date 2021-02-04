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

module.exports = async (deployer, network) => {
  const ownerAddress = "0x7d4A13FE119C9F36425008a7afCB2737B2bB5C41";
  let UNI;
  let UNI_R;
  let usdc;
  let link;
  let augur;
  let bat;
  let wbtc;
  let weth;

  if(network != "mainnet") {
    console.log("Connected to: " + network);
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

   usdc = await FakeUSDC.deployed();
   link = await FakeLink.deployed();
   augur = await FakeAugur.deployed();
   bat = await FakeBAT.deployed();
   wbtc = await FakewBTC.deployed();
   weth = await FakewETH.deployed();

  await link.transferOwnership(FakeFaucet.address);
  await augur.transferOwnership(FakeFaucet.address);
  await bat.transferOwnership(FakeFaucet.address);
  await wbtc.transferOwnership(FakeFaucet.address);
  await weth.transferOwnership(FakeFaucet.address);

  console.log(FakeUSDC.address);
  console.log(FakeLink.address);
  console.log(FakeAugur.address);
  console.log(FakeBAT.address);
  console.log(FakewBTC.address);
  console.log(FakewETH.address);
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
   UNI = await UniswapV2Factory.deployed();
   UNI_R = await UniswapV2Router02.deployed();
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
} else {
  UNI = await UniswapV2Factory.at(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
  UNI_R = await UniswapV2Router02.at(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
   usdc = await FakeUSDC.at(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
   link = await FakeLink.at();
   augur = await FakeAugur.at();
   bat = await FakeBAT.at();
   wbtc = await FakewBTC.at();
   weth = await FakewETH.at();

}
  await deployer.deploy(
    UniswapOracleFactory,
    usdc.address,
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
};
