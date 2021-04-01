const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const ARTFactory = artifacts.require("ARTFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");

const bnb = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const tether = "0x55d398326f99059fF775485246999027B3197955";
const eth = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";
const chainlink = "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD";
const xrp = "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE";
const litecoin = "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94";
const filecoin = "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153";
const bch = "0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf";
const btcb = "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c";
const tezos = "0x16939ef78684453bfDFb47825F8a5F714f12623a";
const atom = "0x0Eb3a705fc54725037CC9e008bDede697f62F335";
const ada = "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47";
const eos = "0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6";
const cake = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
const uni = "0xbf5140a22578168fd562dccf235e5d43a02ce9b1";


module.exports = async (deployer, network) => {
  MMC = await MoneyMarketControl.deployed();
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up Asko Money Market Instance");
  await MMC.whitelistAsset(bnb, 2, "Wrapped BNB", "wBNB");
  console.log("BNB White Listed");
  await MMC.setUpAHR(
    "50000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    bnb //asset address
  );
  console.log("Asko Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    bnb
  );
  console.log("Asko Asko Low Risk Token Created");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up Asko Money Market Instance");
  await MMC.whitelistAsset(chainlink, 2, "ChainLink", "LINK");
  console.log("ChainLink White Listed");
  await MMC.setUpAHR(
    "50000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    chainlink //asset address
  );
  console.log("Asko Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    chainlink
  );
  console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(tether, 2, "Tether", "USDT");
  // console.log("Tether White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   tether //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   tether
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(eth, 2, "Ether", "ETH");
  // console.log("Ether White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   eth //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   eth
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(xrp, 2, "XRP", "XRP");
  // console.log("XRP White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   xrp //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   xrp
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(litecoin, 2, "LightCoin", "LTC");
  // console.log("LightCoin White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   litecoin //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   litecoin
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(filecoin, 2, "FileCoin", "FIL");
  // console.log("FileCoin White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   filecoin //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   filecoin
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(btcb, 2, "Bitcoin", "BTC");
  // console.log("Bitcoin White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   btcb //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   btcb
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(bch, 2, "Bitcoin Cash", "BCH");
  // console.log("Bitcoin Cash White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   bch //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   bch
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(tezos, 2, "Tezos", "XTZ");
  // console.log("Tezos White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   tezos //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   tezos
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(atom, 2, "ATOM", "ATOM");
  // console.log("ATOM White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   atom //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   atom
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(ada, 2, "Cardano", "ADA");
  // console.log("Cardano White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   ada //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   ada
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(eos, 2, "EOS", "EOS");
  // console.log("EOS White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   eos //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   eos
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(cake, 2, "PancakeSwap Token", "Cake");
  // console.log("Cake White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   cake //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   cake
  // );
  // console.log("Asko Asko Low Risk Token Created");
  // ////////////////////////////////////////////////////////////////////////////////////////////
  // console.log("Setting up Asko Money Market Instance");
  // await MMC.whitelistAsset(uni, 2, "Uniswap Token", "UNI");
  // console.log("UNI White Listed");
  // await MMC.setUpAHR(
  //   "50000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   uni //asset address
  // );
  // console.log("Asko Asko High Risk Token Created");
  // await MMC.setUpALR(
  //   "20000000000000000", //base rate per year(approx target base APR)
  //   "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
  //   "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
  //   "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
  //   "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
  //   uni
  // );
  // console.log("Asko Asko Low Risk Token Created");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log(
    "Uniswap oracle factory address: " + UniswapOracleFactory.address
  );
  console.log("Money Market Control: " + MoneyMarketControl.address);
  ////////////////////////////////////////////////////////////////////////////////////////////
};
