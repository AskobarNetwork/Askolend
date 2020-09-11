pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./AskoHighRisk.sol";
import "./AskoLowRisk.sol";
import "./UniswapOracle.sol";
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

  IERC20 public asset;
  AskoHighRisk public AHR;
  AskoLowRisk public ALR;


  constructor (
    address _assetContractAdd,
		uint _depositAmount,
    uint _collateralizationRatio,
    uint _baseRate,
    uint _multiplierM,
    uint  _multiplierN,
    uint _optimal,
    uint _fee,
		string memory _assetName,
		string memory _assetSymbol
  )
  public
  {
    asset = IERC20(_assetContractAdd);

    AHR = AskoHighRisk(address(new AskoHighRisk(
      _assetName,
      _assetSymbol
    )));

    ALR = AskoLowRisk(address(new AskoLowRisk(
      _assetName,
      _assetSymbol
    )));
  }

/**

**/
  function mintAHR(uint _amount) internal {

  }

/**

**/
	function	mintALR(uint _amount)internal {

  }

/**

**/
  function setCollateralizationRatio(uint _ratio) public onlyOwner {

  }

/**

**/
  function setBaseRate(uint _ratio) public onlyOwner {

  }

/**

**/
  function setMultiplierM(uint _ratio) public onlyOwner {

  }

/**

**/
  function setMultiplierN(uint _ratio) public onlyOwner {

  }

/**

**/
  function setOptimal(uint _ratio) public onlyOwner {

  }

/**

**/
  function setFee(uint _ratio) public onlyOwner {

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
