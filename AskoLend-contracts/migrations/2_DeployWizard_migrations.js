const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const FakeLink = artifacts.require("FakeLink");
const FakeAugur = artifacts.require("FakeAugur");
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
  let wETH;
  let link;
  let augur;

  if(network != "mainnet") {
    console.log("Connected to: " + network);
  await deployer.deploy(FakeLink);
  await deployer.deploy(FakeAugur);
  await deployer.deploy(FakewETH);
  await deployer.deploy(
    FakeFaucet,
    FakeLink.address,
    FakeAugur.address,
    FakewETH.address,
    FakewETH.address,
    FakewETH.address
  );

   link = await FakeLink.deployed();
   augur = await FakeAugur.deployed();
   wETH = await FakewETH.deployed();

  await link.transferOwnership(FakeFaucet.address);
  await augur.transferOwnership(FakeFaucet.address);
  await wETH.transferOwnership(FakeFaucet.address);

  console.log(FakeLink.address);
  console.log(FakeAugur.address);
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
    wETH.address
  );
  console.log("UniSwap Router Deployed");
   UNI = await UniswapV2Factory.deployed();
   UNI_R = await UniswapV2Router02.deployed();
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing wETH-AGR");
  await UNI.createPair(FakewETH.address, FakeAugur.address);
  console.log("pair created");
  const wETH_AGR = await UNI.getPair(FakewETH.address, FakeAugur.address);
  console.log("wETH-AGR pair created");
  console.log(wETH_AGR);
  await wETH.approve(UNI_R.address, "10000000000000000000000000000");
  await augur.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    wETH.address,
    augur.address,
    "600000000000000000000000000", //6000000 wETH
    "30000000000000000000000000", // 300000 augur
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair1 = await UniswapV2Pair.at(wETH_AGR);
  pair1.sync();
  console.log("Listed wETH-AGR");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Listing wETH-LINK");
  await UNI.createPair(FakewETH.address, FakeLink.address);
  const wETH_Link = await UNI.getPair(FakewETH.address, FakeLink.address);
  console.log("wETH-FakeLink pair created");
  console.log(wETH_Link);
  await wETH.approve(UNI_R.address, "10000000000000000000000000000");
  await link.approve(UNI_R.address, "10000000000000000000000000000");
  console.log("Transfer Approvals Approved!");
  await UNI_R.addLiquidity(
    wETH.address,
    link.address,
    "400000000000000000000000000", //4000000 wETH
    "40000000000000000000000000", // 400000link
    "0",
    "0",
    ownerAddress,
    100000000000000
  );
  const pair2 = await UniswapV2Pair.at(wETH_Link);
  pair2.sync();
  console.log("Listed wETH_FakeLink");
  ////////////////////////////////////////////////////////////////////////////////////////////
} else {
  console.log("Mainnet")

}
console.log("Deploying oracle factory")
  await deployer.deploy(
    UniswapOracleFactory,
    UniswapV2Factory.address,
    UNI_R.address,
    wETH.address
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
