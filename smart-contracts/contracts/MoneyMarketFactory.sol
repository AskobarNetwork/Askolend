pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MoneyMarketInstance.sol";
import "./interfaces/UniswapOracleFactoryI.sol";


////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The MoneyMarketFactory contract is designed to produce individual MoneyMarketInstance contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract MoneyMarketFactory is Ownable {

  uint public instanceCount;//tracks the number of instances
  address public usdc;//address of stablecoin for $ amounts through the oracle
  address public factoryU;//address of the uniswap factory to be passed to the oracle factory

  UniswapOracleFactoryI public Oracle;//oracle factory contract interface

  mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance

/**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to set up the usdc, factoryU, and Oracle variables for the MoneyMarketFactory contract.
@param _usdc is the contract address for the USDC stablecoin contract
@param _factoryU is the address for the uniswap factory contract
@param _oracle is the address for the UniswapOracleFactorycontract
**/
constructor (address _usdc, address _factoryU, address _oracle) public {
  usdc = _usdc;
  factoryU = _factoryU;
  Oracle = UniswapOracleFactoryI(_oracle);
}

/**
@notice whitelistAsset is an onlyOwner function designed to be called by the AskoDAO.
        This function creates a new MoneyMarketInstancecontract for an input asset as well
        as a UniswapOracleInstance for the asset.
@param _assetContractAdd is the address of the ERC20 asset being whitelisted
@param _assetName is the name of the asset(e.x: ChainLink)
@param _assetSymbol is the symbol of the asset(e.x: LINK)
**/
  function whitelistAsset(
    address _assetContractAdd,
		string memory _assetName,
		string memory _assetSymbol
  )
  public
  onlyOwner
  {
    instanceCount++;

    address _MMinstance = address(new MoneyMarketInstance (
       _assetContractAdd,
       msg.sender,
  		 _assetName,
  		 _assetSymbol
    ));
    instanceTracker[_assetContractAdd] = _MMinstance;
    Oracle.createNewOracle(factoryU, _assetContractAdd, usdc);
  }




}
