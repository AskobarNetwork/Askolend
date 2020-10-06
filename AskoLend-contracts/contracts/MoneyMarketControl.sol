pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./MoneyMarketInstance.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
import "./interfaces/UniswapOracleInstanceI.sol";
import "./interfaces/MoneyMarketFactoryI.sol";
import "./compound/JumpRateModelV2.sol";



////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The MoneyMarketFactory contract is designed to produce individual MoneyMarketInstance contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract MoneyMarketControl is Ownable {
  using SafeMath for uint;



  uint public instanceCount;//tracks the number of instances

  UniswapOracleFactoryI public Oracle;//oracle factory contract interface
  MoneyMarketFactoryI public MMF;

  mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance
  mapping(address => address) public _ALRtracker; // tracks a money markets address to its ALR token.
  mapping(address => address) public oracleTracker; //maps a MM oracle to its Money market address


/**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to set up Oracle variables for the MoneyMarketFactory contract.
@param _oracle is the address for the UniswapOracleFactorycontract
**/
constructor ( address _oracle, address _MMF) public {
  Oracle = UniswapOracleFactoryI(_oracle);
  MMF = MoneyMarketFactoryI(_MMF);
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

  address oracle = address(Oracle.createNewOracle( _assetContractAdd));

    address _MMinstance = MMF.createMMI(
       _assetContractAdd,
       msg.sender,
       oracle,
       address(Oracle),
  		 _assetName,
  		 _assetSymbol
    );


    Oracle.linkMMI(_MMinstance, _assetContractAdd);
    instanceTracker[_assetContractAdd] = _MMinstance;
    oracleTracker[_MMinstance] = oracle;
  }

/**
@notice setUpAHR is used to set up a MoneyMarketInstances Asko High Risk Token as well as its InterestRateModel
@param _baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)
@param _multiplierPerYear  The rate of increase in interest rate wrt utilization (scaled by 1e18)
@param _jumpMultiplierPerYear The multiplierPerBlock after hitting a specified utilization point
@param _optimal The utilization point at which the jump multiplier is applied(Refered to as the Kink in the InterestRateModel)
@param _fee is a number representing the fee for exchanging an ALR token, as a mantissa (scaled by 1e18)
@param _assetContractAdd is the contract address of the asset whos MoneyMarketInstance is being set up
@dev this function can only be called after an asset has been whitelisted as it needs an existing MoneyMarketInstance contract
**/
  function setUpAHR(
    uint _baseRatePerYear,
    uint _multiplierPerYear,
    uint _jumpMultiplierPerYear,
    uint _optimal,
    uint _fee,
    uint _initialExchangeRate,
    address _assetContractAdd
  )
  public
  {
    MoneyMarketInstance _MMI = MoneyMarketInstance(instanceTracker[_assetContractAdd]);

    address interestRateModel = address( new JumpRateModelV2(
      _baseRatePerYear,
      _multiplierPerYear,
      _jumpMultiplierPerYear,
      _optimal,
      address(_MMI)
    ));

_MMI._setUpAHR(
  interestRateModel,
  _fee,
  _initialExchangeRate
);
  }

/**
@notice setUpAHR is used to set up a MoneyMarketInstances Asko High Risk Token as well as its InterestRateModel
@param _baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)
@param _multiplierPerYear  The rate of increase in interest rate wrt utilization (scaled by 1e18)
@param _jumpMultiplierPerYear The multiplierPerBlock after hitting a specified utilization point
@param _optimal The utilization point at which the jump multiplier is applied(Refered to as the Kink in the InterestRateModel)
@param _fee is a number representing the fee for exchanging an ALR token, as a mantissa (scaled by 1e18)
@param _assetContractAdd is the contract address of the asset whos MoneyMarketInstance is being set up
@dev this function can only be called after an asset has been whitelisted as it needs an existing MoneyMarketInstance contract
**/
  function setUpALR(
    uint _baseRatePerYear,
    uint _multiplierPerYear,
    uint _jumpMultiplierPerYear,
    uint _optimal,
    uint _fee,
    uint _initialExchangeRate,
    address _assetContractAdd
  )
  public
  {
    MoneyMarketInstance _MMI = MoneyMarketInstance(instanceTracker[_assetContractAdd]);

    address interestRateModel = address( new JumpRateModelV2(
      _baseRatePerYear,
      _multiplierPerYear,
      _jumpMultiplierPerYear,
      _optimal,
      address(_MMI)
    ));

    _MMI._setUpALR(
      interestRateModel,
      _fee,
      _initialExchangeRate
    );
  }


}
