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
  divisor = 10000;
  assetName = _assetName;
  assetSymbol = _assetSymbol;
  UOF = UniswapOracleFactoryI(_oracleFactory);
  MMF = MoneyMarketFactoryI(_owner);
  asset = IERC20(_assetContractAdd);
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
//abi encode and concat strings
  bytes memory ahrsymbol = abi.encodePacked("AHR-");
  ahrsymbol = abi.encodePacked(ahrsymbol, assetSymbol);
//abi encode and concat strings
  string memory assetNameAHR = string(ahrname);
  string memory assetSymbolAHR = string(ahrsymbol);
//un-encode concated string
  AHR = new AskoRiskToken(//creates new Asko High Risk Token Contract
    _InterestRateModel,
    address(asset),
    address(UOF),
    assetNameAHR,
    assetSymbolAHR,
    false,
    _initialExchangeRate
  );
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
//abi encode and concat strings
    bytes memory alrsymbol = abi.encodePacked("AlR-");
    alrsymbol = abi.encodePacked(alrsymbol, assetSymbol);
//abi encode and concat strings
    string memory assetNameALR = string(alrname);
    string memory assetSymbolALR = string(alrsymbol);
//un-encode concated string
    ALR = new AskoRiskToken(//creates new Asko Low Risk Token Contract
      _InterestRateModel,
      address(asset),
      address(UOF),
      assetNameALR,
      assetSymbolALR,
      true,
      _initialExchangeRate
    );
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
      //transfer appropriate amount off the asset from msg.sender to the AHR contract
      asset.transferFrom(msg.sender, address(ALR), _amount);
      //call mint function on ALR contract
      ALR.mint(msg.sender, _amount);
    }


/**
@notice borrow is used to take out a loan from in MoneyMarketInstance's underlying asset
@param _amount is the amount of asset being barrowed
**/
  function borrow(uint _amount, address _collateral) public {
    //check that the user has enough collateral in input moeny market
    uint collateralValue = MMF.checkCollateralValue(msg.sender, _collateral);
    //get current borrow balances for each ART
    uint borrowBalAHR = AHR.borrowBalanceCurrent(msg.sender);
    uint borrowBalALR = ALR.borrowBalanceCurrent(msg.sender);
    //calculate the new amount that would be owed if borrow suceeds
    uint totalFutureAmountOwed = borrowBalAHR.add(borrowBalALR.add(_amount));
    //check current asset price
    uint priceOfAsset = UOF.getUnderlyingPrice(address(asset));
    //get the usd price value of _amount
    uint assetAmountValOwed = priceOfAsset.mul(totalFutureAmountOwed);
    //divide amount value by 3
    uint halfVal = assetAmountValOwed.div(2);
    //add 1/2 value to asset value to get 150% asset value
    uint collateralNeeded = assetAmountValOwed.add(halfVal);
    //require collateral value to be greater than 150% of the amount value of loan
    require(collateralValue >= collateralNeeded);
    //cut amount of tokens in half
    uint half = _amount.div(2);
    //borrow half from each pool
    AHR.borrow(half);
    ALR.borrow(half);
  }

/**
@notice repay is used to repay a loan
@param _repayAmount is the amount of the underlying asset being repayed
**/
	function repay(uint _repayAmount) public {
    //get their current owed balance of ALR
    uint accountBorrowsALR = ALR.borrowBalanceCurrent(msg.sender);

    if(accountBorrowsALR != 0) { //if amount owed to ALR isnt zero
          if(accountBorrowsALR >= _repayAmount) { //check if repay amount is greater than ALR borrow balance
            ALR.repayBorrow(_repayAmount); //if it is repay amount to ALR
          } else { //if not
            uint amountToALR = _repayAmount.sub(accountBorrowsALR); //calculate amSount needed to pay off ALR
             ALR.repayBorrow(amountToALR); //pay off ALR
            uint amountToAHR = _repayAmount.sub(amountToALR);//calculate AHR amount
          AHR.repayBorrow(amountToAHR); //pay off towards AHR
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
