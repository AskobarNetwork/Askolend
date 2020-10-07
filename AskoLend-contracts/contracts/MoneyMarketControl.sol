pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./MoneyMarketInstance.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
import "./interfaces/MoneyMarketFactoryI.sol";
import "./compound/JumpRateModelV2.sol";
import "./compound/Exponential.sol";
////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The MoneyMarketFactory contract is designed to produce individual MoneyMarketInstance contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract MoneyMarketControl is Ownable, Exponential {

  using SafeMath for uint;



  uint public instanceCount;//tracks the number of instances
  uint public liquidationIncentiveMantissa = 1.5e18; // 1.5

  UniswapOracleFactoryI public Oracle;//oracle factory contract interface
  MoneyMarketFactoryI public MMF;

  mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance
  mapping(address => address) public _ALRtracker; // tracks a money markets address to its ALR token.
  mapping(address => address) public oracleTracker; //maps a MM oracle to its Money market address
  mapping(address =>mapping(address => uint)) nonCompliant;// tracks user to a market to a time
  mapping(address =>mapping(address => uint)) collateralTracker; //tracks user to a market to an amount collaterlized in that market
  mapping(address => bool) isMMI;

  /**
  @notice onlyMMFactory is a modifier used to make a function only callable by the Money Market Instance contract
  **/
    modifier onlyMMI()  {
      require(isMMI[msg.sender] == true);
      _;
    }
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
     
    isMMI[_MMinstance] = true;
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

/**
@notice trackCollateral is an external function used bya MMI to track collateral amounts globally
@param _borrower is the address of the corrower
@param _ALR is the address of the seller
@param _amount is the amount being collateralized
@dev this function can only be called by a MoneyMarketInstance.
**/
 function trackCollateral(address _borrower, address _ALR, uint _amount) external onlyMMI {
   collateralTracker[_borrower][_ALR] = _amount;
 }

 /**

 **/
 function checkCollateralValue(address _borrower, address _ALR) external view onlyMMI returns(uint) {
   MoneyMarketInstance MMI = MoneyMarketInstance(msg.sender);
   address asset = MMI.getAssetAdd();
   uint priceOfAsset = Oracle.getUnderlyingPrice(asset);
   uint amountOfAssetCollat = collateralTracker[_borrower][_ALR];
   return amountOfAssetCollat.mul(priceOfAsset);
 }

/**
@notice markAccountNonCompliant is used by a potential liquidator to mark an account as non compliant which starts its 30 minute timer
@param _borrower is the address of the non compliant borrower
@param _ART is the address of the money market instances ALR token the user is non-compliant in
**/
  function markAccountNonCompliant(address _borrower, address _ART) public {
    //needs to check for account compliance
    require(nonCompliant[_borrower][_ART] == 0);
    nonCompliant[_borrower][_ART] = now;
  }



/**
@notice The sender liquidates the borrowers collateral. This function is called on the MoneyMarket the borrower owes to.
@param borrower The borrower of this cToken to be liquidated
@param repayAmount The amount of the underlying borrowed asset to repay
@param _ART is the address of the AskoRiskToken
*/
  function liquidateAccount(address borrower, uint repayAmount, AskoRiskToken _ART) public {
       require(now >= nonCompliant[borrower][address(_ART)].add(1800));//checks if its been nonCompliant for more than a half hour
//need to impliment check if this is aloud

    address asset = _ART.getAssetAdd();
    /* Read oracle prices for borrowed and collateral markets */
    uint priceBorrowedMantissa = Oracle.getUnderlyingPrice(asset);
    uint priceCollateralMantissa = Oracle.getUnderlyingPrice(address(_ART));
    require(priceBorrowedMantissa != 0 && priceCollateralMantissa != 0);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
     * Get the exchange rate and calculate the number of collateral tokens to seize:
     *  seizeAmount = actualRepayAmount * liquidationIncentive * priceBorrowed / priceCollateral
     *  seizeTokens = seizeAmount / exchangeRate
     *   = actualRepayAmount * (liquidationIncentive * priceBorrowed) / (priceCollateral * exchangeRate)
     */
    uint exchangeRateMantissa = _ART.exchangeRateCurrent(); // Note: reverts on error
    uint seizeTokens;
    Exp memory numerator;
    Exp memory denominator;
    Exp memory ratio;
    MathError mathErr;

    (mathErr, numerator) = mulExp(liquidationIncentiveMantissa, priceBorrowedMantissa);
    require(mathErr == MathError.NO_ERROR);


    (mathErr, denominator) = mulExp(priceCollateralMantissa, exchangeRateMantissa);
    require(mathErr == MathError.NO_ERROR);

    (mathErr, ratio) = divExp(numerator, denominator);
    require(mathErr == MathError.NO_ERROR);

    (mathErr, seizeTokens) = mulScalarTruncate(ratio, repayAmount);
    require(mathErr == MathError.NO_ERROR);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    _ART._liquidateFor(address(asset), address(this), seizeTokens, repayAmount);
  /**
  this function calls the MoneyMarketInstance where the borrower has collateral staked and has it swap
  its underlying asset on uniswap for the underlying asset borrowed
  **/

      nonCompliant[borrower][address(_ART)] = 0;//resets borrowers compliance timer

  }

}
