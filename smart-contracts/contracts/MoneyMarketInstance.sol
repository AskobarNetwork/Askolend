pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./AskoHighRisk.sol";
import "./AskoLowRisk.sol";

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

  uint256 public collateralizationRatio;
  uint256 public baseRate;
  uint256 public multiplierM;
  uint256 public multiplierN;
  uint256 public optimal;
  uint256 public fee;
  uint256 public assetPoolBalance;

  IERC20 public asset;
  AskoHighRisk public AHR;
  AskoLowRisk public ALR;

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
		string memory _assetName,
		string memory _assetSymbol
  )
  public
  {
    asset = IERC20(_assetContractAdd);



    bytes memory ahrname = abi.encodePacked("AHR-");
    ahrname = abi.encodePacked(ahrname, _assetName);

    bytes memory ahrsymbol = abi.encodePacked("AHR-");
    ahrsymbol = abi.encodePacked(ahrsymbol, _assetSymbol);

    string memory assetNameAHR = string(ahrname);
    string memory assetSymbolAHR = string(ahrsymbol);

    AHR = AskoHighRisk(address(new AskoHighRisk(
      assetNameAHR,
      assetSymbolAHR
    )));

    bytes memory alrname = abi.encodePacked("AlR-");
    alrname = abi.encodePacked(ahrname, _assetName);

    bytes memory alrsymbol = abi.encodePacked("AlR-");
    alrsymbol = abi.encodePacked(ahrsymbol, _assetSymbol);

    string memory assetNameALR = string(alrname);
    string memory assetSymbolALR = string(alrsymbol);

    ALR = AskoLowRisk(address(new AskoLowRisk(
      assetNameALR,
      assetSymbolALR
    )));

  transferOwnership(_owner);
  }

/**
@notice setUp is called by the owner after a contract is created to set up the initial variables.
        This is split from the constructor function to keep from reaching the gas block limit
@param  _collateralizationRatio is used to set collateralizationRatio
@param  _baseRate used to set baseRate
@param  _multiplierM used to set multiplierM
@param  _multiplierN used to set multiplierN
@param  _optimal used to set optimal
@param  _fee used to set fee
**/
function setUp(
    uint _collateralizationRatio,
    uint _baseRate,
    uint _multiplierM,
    uint  _multiplierN,
    uint _optimal,
    uint _fee
  )
  public
  onlyOwner
  {
  collateralizationRatio  = _collateralizationRatio;
  baseRate = _baseRate;
  multiplierM = _multiplierM;
  multiplierN = _multiplierN;
  optimal = _optimal;
  fee = _fee;
  }
/**
@notice setCollateralizationRatio allows the owner of this contract to set the collateralizationRatio
@param  _ratio is a % number 1-100 representing the ratio
**/
  function setCollateralizationRatio(uint _ratio) public onlyOwner {
    collateralizationRatio = _ratio;
  }

/**
@notice setBaseRate allows the owner of this contract to set the baseRate
@param  _rate is the input number representing the rate
**/
  function setBaseRate(uint _rate) public onlyOwner {
      baseRate = _rate;
  }

/**
@notice setMultiplierM allows the owner of this contract to set the multiplierM
@param  _multiplierM is the input number representing the multiplierM
**/
  function setMultiplierM(uint _multiplierM) public onlyOwner {
      multiplierM = _multiplierM;
  }

/**
@notice setMultiplierM allows the owner of this contract to set the multiplierN
@param  _multiplierN is the input number representing the multiplierN
**/
  function setMultiplierN(uint _multiplierN) public onlyOwner {
    multiplierN = _multiplierN;
  }

/**
@notice setOptimal allows the owner of this contract to set the optimal
@param  _optimal is the input number representing the optimal
**/
  function setOptimal(uint _optimal) public onlyOwner {
      optimal = _optimal;
  }

/**
@notice setFee allows the owner of this contract to set the fee
@param  _fee is the input number representing the fee
**/
  function setFee(uint _fee) public onlyOwner {
      fee = _fee;
  }

/**

**/
  function lendToAHRpool() public {

  }

/**

**/
    function lendToALRpool() public {

    }

/**

**/
	function	redeemAHR(uint _amount)public {

  }

/**

**/
	function	redeemALR(uint _amount)public {

  }

/**

**/
  function borrow(uint _amount) public {

  }

/**

**/
	function repay(uint _amount, uint _type) public {

  }


}
