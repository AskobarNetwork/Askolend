pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./compound/Exponential.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
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
contract MoneyMarketInstance is Ownable, Exponential {
    using SafeMath for uint256;

  uint public feePercent;
  uint public divisor;
  uint public fee_AHR;
  uint public fee_ALR;



  string public assetName;
  string public assetSymbol;


  IERC20 public asset;
  AskoRiskToken public AHR;
  AskoRiskToken public ALR;
  MoneyMarketFactoryI public MMF;
  UniswapOracleFactoryI public UOF;



/**
@notice onlyMMFactory is a modifier used to make a function only callable by the Money Market Factory contract
**/
  modifier onlyMMFactory()  {
    require(msg.sender == address(MMF));
    _;
  }


/**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to initialize the MoneyMakerInstance and deploy its associated AHR && ALR token contracts
@param _assetContractAdd is the address of the ERC20 asset being whitelisted
@param _assetName is the name of the asset(e.x: ChainLink)
@param _assetSymbol is the symbol of the asset(e.x: LINK)
@dev this function uses ABI encoding to properly concatenate AHR- && ALR- in front of the tokens name and symbol
      before creating each token.
**/
  constructor (
    address _assetContractAdd,
    address _oracleFactory,
    address _owner,
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
  MMF = MoneyMarketFactoryI(_owner);

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
@notice getAssetAdd allows for easy retrieval of a Money Markets underlying asset's address
**/

  function getAssetAdd() public view returns (address) {
    return address(asset);
  }
/**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's High Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
  function lendToAHRpool(uint _amount) public {
    //transfer appropriate amount off the asset from msg.sender to the AHR contract
    asset.transferFrom(msg.sender, address(AHR), _amount);
    //call mint function on AHR contract
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
  function borrow(uint _amount, address _collateral) public {
    //check that the user has enough collateral in used
    uint collateralValue = MMF.checkCollateralValue(msg.sender, _collateral);
    //check current asset price
    uint priceOfAsset = UOF.getUnderlyingPrice(address(asset));
    //get te usd price value of _amount
    uint assetAmountVal = priceOfAsset.mul(_amount);
    //divide amount value by 3
    uint thirdVal = assetAmountVal.div(3);
    //add 1/3 value to asset value to get 150% asset value
    uint collateralNeeded = assetAmountVal.add(thirdVal);
    //require collateral value to be greater than 150% of the amount value of loan
    require(collateralValue >= collateralNeeded);
    uint half = _amount.div(2);
    AHR.borrow(half);
    ALR.borrow(half);
  }

/**
@notice repay is used to repay a loan
@param _repayAmount is the amount of the underlying asset being repayed
**/
	function repay(uint _repayAmount) public {
    uint accountBorrowsALR = ALR.borrowBalanceCurrent(msg.sender);

    if(accountBorrowsALR != 0) { //if amount owed to ALR isnt zero
          if(accountBorrowsALR >= _repayAmount) { //check if repay amount is greater than ALR borrow balance
            ALR.repayBorrow(_repayAmount); //if it is repay amount to ALR
          } else { //if not
            uint amountToALR = _repayAmount.sub(accountBorrowsALR); //calculate aount needed to pay off ALR
             ALR.repayBorrow(amountToALR); //pay off ALR
            uint amountToAHR = _repayAmount.sub(amountToALR);//calculate AHR amount
          AHR.repayBorrow(amountToAHR);
          }
    } else {//if amount owed to ALR IS zero
      AHR.repayBorrow(_repayAmount);//pay towards AHR
    }
  }



/**
@notice collateralizeALR allows a user to collateralize the ALR they hold in a specific money market
@param _amount is the amount of ALR being collateralized
**/
   function collateralizeALR(uint _amount) public {
     ALR.burn(msg.sender, _amount);
     MMF.trackCollateral(msg.sender, address(ALR), _amount);
   }



}
