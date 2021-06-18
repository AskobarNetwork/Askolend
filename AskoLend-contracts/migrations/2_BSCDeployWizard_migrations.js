const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const UniswapV2Pair = artifacts.require("UniswapV2Pair");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const MoneyMarketFactory = artifacts.require("MoneyMarketFactory");
const ARTFactory = artifacts.require("ARTFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");

module.exports = async (deployer, network) => {
  console.log(network)


console.log("Deploying oracle factory")
  await deployer.deploy(
    UniswapOracleFactory,
    "0xBCfCcbde45cE874adCB698cC183deBcF17952812", //pancake factory
    "0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F", //pancake router
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //wBNB
  );
  console.log("Oracle Factory Deployed");

};
