pragma solidity ^0.5.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AskoRiskToken.sol";
import "./interfaces/MoneyMarketFactoryI.sol";
import "./interfaces/UniswapOracleInstanceI.sol";
import "./compound/InterestRateModel.sol";
import "./compound/ComptrollerInterface.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketInstance
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The MoneyMarketInstance contract is designed facilitate a tiered money market for an individual ERC20 asset
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol && IRC20.sol
**/
contract MoneyMarketInstance is Ownable {
    using SafeMath for uint256;

  uint256 public blocksPerYear;
  uint256 public feePercent;
  uint256 public divisor;
  uint256 public assetAHRPoolBalance;
  uint256 public assetALRPoolBalance;
  uint256 public assetAHRborrowBalance;
  uint256 public assetALRborrowBalance;
  uint256 public fee_AHR;
  uint256 public fee_ALR;
  address public factoryMM;
  string public assetName;
  string public assetSymbol;


  IERC20 public asset;
  AskoRiskToken public AHR;
  AskoRiskToken public ALR;
  UniswapOracleInstanceI public oracle;
  MoneyMarketFactoryI public MMF;






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
		string memory _assetName,
		string memory _assetSymbol
  )
  public
  {
    asset = IERC20(_assetContractAdd);


  divisor = 10000;
  blocksPerYear = 2102400;
  assetName = _assetName;
  assetSymbol = _assetSymbol;
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

  AHR = AskoRiskToken(address(new AskoRiskToken(
    address(asset),
    ComptrollerInterface(owner()),
    InterestRateModel(_InterestRateModel),
    _initialExchangeRate,
    assetNameAHR,
    assetSymbolAHR,
    8,
    address(uint160(address(this))),
    false
  )));

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

    ALR = AskoRiskToken(address(new AskoRiskToken(
      address(asset),
      ComptrollerInterface(owner()),
      InterestRateModel(_InterestRateModel),
      _initialExchangeRate,
      assetNameALR,
      assetSymbolALR,
      8,
      address(uint160(address(this))),
      true
    )));

    address alr = address(ALR);
    asset.approve(alr, 1000000000000000000000000000000000000);
    }



/**
@notice setFee allows the owner of this contract to set the fee
@param  _fee is the input number representing the fee
@dev the divisor is set to 10,000 in the constructor for this contract. this allows for
      a fee percentage accounting for two decimal places. feePercent must account for this when being set.
      The following examples show feePercent amounts and how they equate to percentages:
              EX:
                  a 1% fee would be set as feePercent = 100
                  a .5% fee would be set as feePercent = 50
                  a 50% fee would be set as feePercent = 5000
**/
  function setFeeAHR(uint _fee) public onlyOwner {
      fee_AHR = _fee;
  }

/**
@notice setFee allows the owner of this contract to set the fee
@param  _fee is the input number representing the fee
@dev the divisor is set to 10,000 in the constructor for this contract. this allows for
      a fee percentage accounting for two decimal places. feePercent must account for this when being set.
      The following examples show feePercent amounts and how they equate to percentages:
              EX:
                  a 1% fee would be set as feePercent = 100
                  a .5% fee would be set as feePercent = 50
                  a 50% fee would be set as feePercent = 5000
**/
  function setFeeALR(uint _fee) public onlyOwner {
      fee_ALR = _fee;
  }


/**
@notice calculateFee is used to calculate the fee earned
@param _payedAmount is a uint representing the full amount of an ERC20 asset payed
@dev the divisor is set to 10,000 in the constructor for this contract. this allows for
      a fee percentage accounting for two decimal places. feePercent must account for this when being set.
      The following examples show feePercent amounts and how they equate to percentages:
              EX:
                  a 1% fee would be set as feePercent = 100
                  a .5% fee would be set as feePercent = 50
                  a 50% fee would be set as feePercent = 5000
**/
function calculateFee(uint256 _payedAmount) public view returns(uint) {
  uint256 fee = _payedAmount.mul(feePercent).div(divisor);
  return fee;
}

/**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's High Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
  function lendToAHRpool(uint _amount) public {
        asset.transferFrom(msg.sender, address(this), _amount);
        AHR.mint(_amount);
  }

/**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's Low Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
    function lendToALRpool(uint _amount) public {
        asset.transferFrom(msg.sender, address(this), _amount);
        ALR.mint(_amount);
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
    uint accountBorrowsALR = ALR.borrowBalanceStored(msg.sender);

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



}
