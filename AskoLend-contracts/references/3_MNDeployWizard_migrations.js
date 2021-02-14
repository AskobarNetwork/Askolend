const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const ARTFactory = artifacts.require("ARTFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");
const FakeFaucet = artifacts.require("FakeFaucet");
const asko = "0xeEEE2a622330E6d2036691e983DEe87330588603";
const bat = "0x0D8775F648430679A709E98d2b0Cb6250d2887EF";
const dai = "0x6b175474e89094c44da98b954eedeac495271d0f";
const enjin = "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c";
const wETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const link = "0x514910771af9ca656af840dff83e8264ecf986ca";
const renbtc = "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d";
const uni = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";
const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const usdt = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const wbtc = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";

module.exports = async (deployer, network) => {

  MMC = await MoneyMarketControl.deployed();
  console.log("Setting up Asko Money Market Instance");
  await MMC.whitelistAsset(asko, 2, "Asko", "ASKO");
  console.log("ASKO White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    asko //asset address
  );
  console.log("Asko Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    asko
  );
  console.log("Asko Asko Low Risk Token Created");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up BAT Money Market Instance");
  await MMC.whitelistAsset(bat, 2, "Basic Attention Token", "BAT");
  console.log("BAT White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    bat
  );
  console.log("BAT Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    bat
  );
  console.log("BAT Asko Low Risk Token Created");
  ////////////////////////////////////////////////////////////////////////////////////////////

  console.log("Setting up DAI Money Market Instance");
  await MMC.whitelistAsset(dai, 2, "Dai", "DAI");
  console.log("DAI White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    dai
  );
  console.log("DAI Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    dai
  );
  console.log("DAI Asko Low Risk Token Created");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up enjin Money Market Instance");
  await MMC.whitelistAsset(enjin, 2, "Enjin", "ENJ");
  console.log("enjin White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    enjin
  );
  console.log("enjin Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    enjin
  );
  console.log("enjin Asko Low Risk Token Created");
  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up wETH Money Market Instance");
  await MMC.whitelistAsset(wETH, 2, "Wrapped ETH", "wETH");
  console.log("wETH White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    wETH
  );
  console.log("wETH Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    wETH
  );
  console.log("wETH Asko Low Risk Token Created");
}

  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up link Money Market Instance");
  await MMC.whitelistAsset(link, 2, "ChainLink", "LINK");
  console.log("link White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    link
  );
  console.log("link Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    link
  );
  console.log("link Asko Low Risk Token Created");
}

  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up renbtc Money Market Instance");
  await MMC.whitelistAsset(renbtc, 2, "renBTC", "renBTC");
  console.log("renbtc White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    renbtc
  );
  console.log("renbtc Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    renbtc
  );
  console.log("renbtc Asko Low Risk Token Created");
}

  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up uni Money Market Instance");
  await MMC.whitelistAsset(uni, 2, "Uni", "UNI");
  console.log("uni White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    uni
  );
  console.log("uni Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    uni
  );
  console.log("uni Asko Low Risk Token Created");
}

  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up usdc Money Market Instance");
  await MMC.whitelistAsset(usdc, 2, "US Dollar Coin", "USDC");
  console.log("usdc White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    usdc
  );
  console.log("usdc Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    usdc
  );
  console.log("usdc Asko Low Risk Token Created");
}

  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up usdt Money Market Instance");
  await MMC.whitelistAsset(usdt, 2, "US Dollar Tether", "USDT");
  console.log("usdt White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    usdt
  );
  console.log("usdt Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    usdt
  );
  console.log("usdt Asko Low Risk Token Created");
}

  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Setting up wbtc Money Market Instance");
  await MMC.whitelistAsset(wbtc, 2, "Wrapped Bitcoin", "wBTC");
  console.log("wbtc White Listed");
  await MMC.setUpAHR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    wbtc
  );
  console.log("wbtc Asko High Risk Token Created");
  await MMC.setUpALR(
    "20000000000000000", //base rate per year(approx target base APR)
    "22222222222200000", //multiplier per year(rate of increase in interest w/ utilizastion)
    "40", //Jump Multiplier Per Year(the multiplier per block after hitting a specific utilizastion point)
    "900000000000000000", //optimal(this is the utilizastion point or "kink" at which the jump multiplier is applied)
    "1000000000000000000", //intitial exchange rate(the rate at which the initial exchange of asset/ART is set)
    wbtc
  );
  console.log("wbtc Asko Low Risk Token Created");
}

  ////////////////////////////////////////////////////////////////////////////////////////////
  console.log(
    "Uniswap oracle factory address: " + UniswapOracleFactory.address
  );
  console.log("Money Market Control: " + MoneyMarketControl.address);
  ////////////////////////////////////////////////////////////////////////////////////////////
};
