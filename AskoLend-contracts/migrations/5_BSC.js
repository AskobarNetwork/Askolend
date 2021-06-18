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

const belt = "0xe0e514c71282b6f4e823703a39374cf58dc3ea4f";
const bunny = "0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51";
const eps = "0xa7f552078dcc247c2684336020c03648500c6d9f";
const alice = "0xac51066d7bec65dc4589368da368b212745d63e8";

module.exports = async (deployer, network) => {
  MMC = await MoneyMarketControl.deployed();
  ////////////////////////////////////////////////////////////////////////////////////////////

  await MMC.setUpAHR(
    "30000000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    alice //asset address
  );
  console.log("Asko Asko High Risk Token Created");
  await MMC.setUpALR(
    "10000000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    alice
  );
  console.log("Asko Asko Low Risk Token Created");
};
