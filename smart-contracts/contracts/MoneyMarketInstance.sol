pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./AskoHighRisk.sol";
import "./AskoLowRisk.sol";
import "./interfaces/MoneyMarketFactoryI.sol";
import "./interfaces/UniswapOracleInstanceI.sol";
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


  uint256 public collateralizationRatio;
  uint256 public baseRate;
  uint256 public multiplierM;
  uint256 public multiplierN;
  uint256 public optimal;
  uint256 public fee;
  uint256 public assetAHRPoolBalance;
  uint256 public assetALRPoolBalance;
  address public factoryMM;


  IERC20 public asset;
  AskoHighRisk public AHR;
  AskoLowRisk public ALR;
  UniswapOracleInstanceI public oracle;
  MoneyMarketFactoryI public MMF;

  mapping(address => uint) public lentToAHRpool;
  mapping(address => uint) public lentToALRpool;
  mapping(address => uint) public amountBorrowed;

/**
@notice onlyMMFactory is a modifier used to make a function only callable by the Money Market Factory
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

  oracle = UniswapOracleInstanceI(_oracle);
  MMF = MoneyMarketFactoryI(msg.sender);
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
function getALRadd() public view returns(address) {
  return address(ALR);
}

/**

**/
function factoryBurn(address _account, uint _amount) external onlyMMFactory {
  ALR.burn(_account, _amount);
}

/**

**/
function factoryMint(address _account, uint _amount) external onlyMMFactory {
  ALR.mint(_account, _amount);
}

/**
@notice calculateAHRInterest is used to calculate the earned interest for the High Risk pool

**/
function calculateAHRexchangeRate(uint _amount) public view returns(uint) {

}

/**
@notice calculateALRInterest is used to calculate the earned interest for the Low Risk pool
**/
function calculateALRexchangeRate(uint _amount) public view returns(uint){

}

/**
@notice calculateLoanInterest is used to calculate the interest for a loan
**/
function calculateLoanInterest(uint _amount) public view returns(uint){

}

/**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's High Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
  function lendToAHRpool(uint _amount) public {
        asset.transferFrom(msg.sender, address(this), _amount);
        assetAHRPoolBalance = assetAHRPoolBalance.add(_amount);
        lentToAHRpool[msg.sender] = _amount;
  }

/**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's Low Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
    function lendToALRpool(uint _amount) public {
        asset.transferFrom(msg.sender, address(this), _amount);
        assetALRPoolBalance = assetALRPoolBalance.add(_amount);
        lentToALRpool[msg.sender] = _amount;
    }

/**
@notice redeemAHR is used to redeem AHR toke for its underlying asset + interest
@param _amount is the amount of AHR being redeemed
**/
	function	redeemAHR(uint _amount)public {
    AHR.burn(msg.sender, _amount);
    uint interestAmount = calculateAHRexchangeRate(_amount);
    uint totalVal = _amount.add(interestAmount);
    asset.transfer(msg.sender, totalVal);
  }

/**
@notice redeemALR is used to redeem ALR toke for its underlying asset + interest
@param _amount is the amount of ALR being redeemed
**/
	function	redeemALR(uint _amount)public {
    ALR.burn(msg.sender, _amount);
    uint interestAmount = calculateALRexchangeRate(_amount);
    uint totalVal = _amount.add(interestAmount);
    asset.transfer(msg.sender, totalVal);
  }

/**
@notice borrow is used to take out a loan from in MoneyMarketInstance's underlying asset
@param _amount is the amount of asset being barrowed
**/
  function borrow(uint _amount) public {
      uint half = _amount.div(2);
      require(lentToAHRpool[msg.sender] >= half, "Not enough AHR liquidity");
      require(lentToALRpool[msg.sender] >= half, "Not enough ALR liquidity");
      uint stakedValue = MMF.getTotalStakeValue(msg.sender);
      require(stakedValue > _amount, "Not Enough Collateral");
      amountBorrowed[msg.sender] = amountBorrowed[msg.sender].add(_amount);
      asset.transfer(msg.sender, _amount);
  }

/**
@notice repay is used to repay a loan
@dev this function
**/
	function repay() public {
    uint amountOwed = calculateLoanInterest(amountBorrowed[msg.sender]);
    uint userAssetBal = asset.balanceOf(msg.sender);
    require(userAssetBal >= amountOwed, "Balance too low to pay off loan");
    asset.transferFrom(msg.sender, address(this), amountOwed);
    amountBorrowed[msg.sender] = 0;
    MMF._repay(address(this), msg.sender);
  }



}
