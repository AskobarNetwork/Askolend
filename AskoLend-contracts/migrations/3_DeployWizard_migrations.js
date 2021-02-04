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
  if(network != "mainnet") {

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
} else {

  usdc = await FakeUSDC.at(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
  link = await FakeLink.at();
  augur = await FakeAugur.at();
  bat = await FakeBAT.at();
  wbtc = await FakewBTC.at();
  weth = await FakewETH.at();


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
}

  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log(
    "Uniswap oracle factory address: " + UniswapOracleFactory.address
  );
  console.log("USDC address: " + FakeUSDC.address);
  console.log("Link address: " + FakeLink.address);
  console.log("Augur address: " + FakeAugur.address);
  console.log("wBTC address: " + FakewBTC.address);
  console.log("wETH address: " + FakewETH.address);
  console.log("Fake Faucet address: " + FakeFaucet.address);
  console.log("Money Market Control: " + MoneyMarketControl.address);
  ////////////////////////////////////////////////////////////////////////////////////////////
};
