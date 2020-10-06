pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./compound/InterestRateModel.sol";
import "./compound/Exponential.sol";
import "./compound/ErrorReporter.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
import "./interfaces/UniswapOracleInstanceI.sol";
import "./interfaces/MoneyMarketFactoryI.sol";
import "./AskoRiskToken.sol";


////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketInstance
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The MoneyMarketInstance contract is designed facilitate a tiered money market for an individual ERC20 asset
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol && IRC20.sol
**/
contract MoneyMarketInstance is Ownable, Exponential, TokenErrorReporter {
    using SafeMath for uint256;

  uint public feePercent;
  uint public divisor;
  uint public fee_AHR;
  uint public fee_ALR;
  uint public liquidationIncentiveMantissa = 1.5e18; // 1.5


  string public assetName;
  string public assetSymbol;


  IERC20 public asset;
  AskoRiskToken public AHR;
  AskoRiskToken public ALR;
  UniswapOracleInstanceI public oracle;
  MoneyMarketFactoryI public MMF;
  UniswapOracleFactoryI public UOF;

  mapping(address => uint) public nonCompliant;







/**
@notice onlyMMFactory is a modifier used to make a function only callable by the Money Market Factory contract
**/
  modifier onlyMMFactory()  {
    require(msg.sender == address(MMF), "Only Money Market Factory: caller is not the Money Market Factory");
    _;
  }


/**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to initialize the MoneyMakerInstance and deploy its associated AHR && ALR token contracts
@param _assetContractAdd is the address of the ERC20 asset being whitelisted
@param _owner is the address that will own this contract(The AskoDAO)
@param _assetName is the name of the asset(e.x: ChainLink)
@param _assetSymbol is the symbol of the asset(e.x: LINK)
@dev this function uses ABI encoding to properly concatenate AHR- && ALR- in front of the tokens name and symbol
      before creating each token.
**/
  constructor (
    address _assetContractAdd,
    address _owner,
    address _oracle,
    address _oracleFactory,
		string memory _assetName,
		string memory _assetSymbol
  )
  public
  {
    asset = IERC20(_assetContractAdd);


  divisor = 10000;
  assetName = _assetName;
  assetSymbol = _assetSymbol;
  UOF = UniswapOracleFactoryI(_oracleFactory);
  oracle = UniswapOracleInstanceI(_oracle);
  MMF = MoneyMarketFactoryI(msg.sender);
  transferOwnership(_owner);

  }

/**
@notice setUp is called by the MoneyMarketFactory after a contract is created to set up the initial variables.
        This is split from the constructor function to keep from reaching the gas block limit
@param  _InterestRateModel is the address of this MoneyMarketInstances InterestRateModel
@param _fee is a number representing the fee for exchanging an AHR token, as a mantissa (scaled by 1e18)
@dev this function will create a token whos name and symbol is concatenated with a "AHR-" in front of it
      example: AHR-LINK
@dev asset.approve() is called to allow the AHR contract to freeely transfer the assset from this contract when the mint
      lendToAHRpool function is called.
**/
function _setUpAHR(
    address _InterestRateModel,
    uint _fee,
    uint _initialExchangeRate
  )
  public
  onlyMMFactory
  {
  fee_AHR = _fee;
  bytes memory ahrname = abi.encodePacked("AHR-");
  ahrname = abi.encodePacked(ahrname, assetName);

  bytes memory ahrsymbol = abi.encodePacked("AHR-");
  ahrsymbol = abi.encodePacked(ahrsymbol, assetSymbol);

  string memory assetNameAHR = string(ahrname);
  string memory assetSymbolAHR = string(ahrsymbol);

  AHR = new AskoRiskToken(
    _InterestRateModel,
    address(asset),
    address(UOF),
    assetNameAHR,
    assetSymbolAHR,
    false,
    _initialExchangeRate
  );

  address ahr = address(AHR);

  asset.approve(ahr, 1000000000000000000000000000000000000);
  }

/**
@notice setUp is called by the MoneyMarketFactory after a contract is created to set up the initial variables.
        This is split from the constructor function to keep from reaching the gas block limit
@param  _InterestRateModel is the address of this MoneyMarketInstances InterestRateModel
@param _fee is a number representing the fee for exchanging an ALR token, as a mantissa (scaled by 1e18)
@dev this function will create a token whos name and symbol is concatenated with a "ALR-" in front of it
      example: ALR-LINK
@dev asset.approve() is called to allow the ALR contract to freeely transfer the assset from this contract when the mint
      lendToALRpool function is called.
**/
  function _setUpALR(
      address _InterestRateModel,
      uint256 _fee,
      uint _initialExchangeRate
    )
    public
    onlyMMFactory
    {
    fee_ALR = _fee;
    bytes memory alrname = abi.encodePacked("AlR-");
    alrname = abi.encodePacked(alrname, assetName);

    bytes memory alrsymbol = abi.encodePacked("AlR-");
    alrsymbol = abi.encodePacked(alrsymbol, assetSymbol);

    string memory assetNameALR = string(alrname);
    string memory assetSymbolALR = string(alrsymbol);

    ALR = new AskoRiskToken(
      _InterestRateModel,
      address(asset),
      address(UOF),
      assetNameALR,
      assetSymbolALR,
      true,
      _initialExchangeRate
    );

    address alr = address(ALR);
    asset.approve(alr, 1000000000000000000000000000000000000);
    }



/**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's High Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
  function lendToAHRpool(uint _amount) public {
    asset.transferFrom(msg.sender, address(AHR), _amount);
    AHR.mint(msg.sender, _amount);
  }

/**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's Low Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
    function lendToALRpool(uint _amount) public {
    asset.transferFrom(msg.sender, address(ALR), _amount);
      ALR.mint(msg.sender, _amount);
    }




/**
@notice borrow is used to take out a loan from in MoneyMarketInstance's underlying asset
@param _amount is the amount of asset being barrowed
**/
  function borrow(uint _amount) public returns(uint) {
      uint half = _amount.div(2);
      uint err = AHR.borrow(half);
       err = ALR.borrow(half);
      return (err);
  }

/**
@notice repay is used to repay a loan
@param _repayAmount is the amount of the underlying asset being repayed
**/
	function repay(uint _repayAmount) public returns(uint) {
    uint accountBorrowsALR = ALR.borrowBalanceCurrent(msg.sender);

    uint err = 0;

    if(accountBorrowsALR != 0) { //if amount owed to ALR isnt zero
          if(accountBorrowsALR >= _repayAmount) { //check if repay amount is greater than ALR borrow balance
             err = ALR.repayBorrow(_repayAmount); //if it is repay amount to ALR
          } else { //if not
            uint amountToALR = _repayAmount.sub(accountBorrowsALR); //calculate aount needed to pay off ALR
             err = ALR.repayBorrow(amountToALR); //pay off ALR
            uint amountToAHR = _repayAmount.sub(amountToALR);//calculate AHR amount
            err = AHR.repayBorrow(amountToAHR);
          }
    } else {//if amount owed to ALR IS zero
       err = AHR.repayBorrow(_repayAmount);//pay towards AHR
    }

    return err;
  }

function markAccountNonCompliant(address borrower) public {
  require(nonCompliant[borrower] == 0);
  nonCompliant[borrower] = now;
}



/**
@notice The sender liquidates the borrowers collateral. This function is called on the MoneyMarket the borrower owes to.
@param borrower The borrower of this cToken to be liquidated
@param repayAmount The amount of the underlying borrowed asset to repay
@param _ART is the address of the AskoRiskToken
 */
function liquidateAccount(address borrower, uint repayAmount, AskoRiskToken _ART) public {

require(now >= nonCompliant[borrower].add(1800));//checks if its been nonCompliant for more than a half hour

  bool allowed = MMF.liquidateBorrowAllowed(address(this), address(_ART), msg.sender, borrower, repayAmount);
  if (!allowed) {
      nonCompliant[borrower] = 0;//resets borrowers compliance timer if its not alloud
  }

  /* Read oracle prices for borrowed and collateral markets */
  uint priceBorrowedMantissa = UOF.getUnderlyingPrice(address(asset));
  uint priceCollateralMantissa = UOF.getUnderlyingPrice(address(_ART));
  require(priceBorrowedMantissa != 0 && priceCollateralMantissa != 0);


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



  _ART._liquidateFor(address(asset), address(this), seizeTokens, repayAmount);
/**
this function calls the MoneyMarketInstance where the borrower has collateral staked and has it swap
its underlying asset on uniswap for the underlying asset borrowed
**/

    nonCompliant[borrower] = 0;//resets borrowers compliance timer

}



}
