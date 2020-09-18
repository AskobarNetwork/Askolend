pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MoneyMarketInstance.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
import "./interfaces/UniswapOracleInstanceI.sol";
import "./interestTools/JumpRateModelV2.sol";

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
  using SafeMath for uint256;



  uint public instanceCount;//tracks the number of instances
  address public usdc;//address of stablecoin for $ amounts through the oracle
  address public factoryU;//address of the uniswap factory to be passed to the oracle factory

  UniswapOracleFactoryI public Oracle;//oracle factory contract interface

  mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance
  mapping(address => address) public _ALRtracker; // tracks a money markets address to its ALR token.
  mapping(address => address) public oracleTracker; //maps a MM oracle to its Money market address
  mapping(address => mapping(address => uint)) public collateralized;// maps a users address to MoneyMakerInstance address to the amount of ALR STAKED
  mapping(address => address[]) public stakedALRs;//tracks which Money Markets a user has ALRs staked in.
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
    address oracle = address(Oracle.createNewOracle(factoryU, _assetContractAdd, usdc));


    address _MMinstance = address(new MoneyMarketInstance (
       _assetContractAdd,
       msg.sender,
       oracle,
  		 _assetName,
  		 _assetSymbol
    ));
    instanceTracker[_assetContractAdd] = _MMinstance;
    oracleTracker[_MMinstance] = oracle;
  }

/**
@notice setUpMoneyMarket
**/
  function setUpMoneyMarket(
    uint _collateralizationRatio,
    uint _baseRatePerYear,
    uint _multiplierPerYear,
    uint _jumpMultiplierPerYear,
    uint _optimal,
    uint _fee,
    address _owner,
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
      _owner
    ));

_MMI.setUp(
  _collateralizationRatio,
  _baseRatePerYear,
  _multiplierPerYear,
  _jumpMultiplierPerYear,
  _optimal,
  _fee,
  interestRateModel
);
  }

/**
@notice stakeALR allows a user to stake his ALR as collateral so that he can borrow from an Money market
@param _MMinstance is the address of the instance that owns the ALR token the user wishes to stake
@param _amount is the amount of ALR token the user wishes to stake
**/
  function stakeALR(address _MMinstance, uint _amount) public {
    MoneyMarketInstance _MMI = MoneyMarketInstance(_MMinstance);
    AskoLowRisk _ALR = AskoLowRisk(_MMI.getALRadd());
    require(_ALR.balanceOf(msg.sender) >= _amount, "Insufficeint ALR balance for this asset");
    _MMI.factoryBurn(msg.sender, _amount);
    collateralized[msg.sender][_MMinstance] = _amount;
    stakedALRs[msg.sender].push(_MMinstance);
  }

/**
@notice getTotalStakeValue calculates the total USDC value of all of the ALR tokens a user has staked
@param _usersAdd is the address of the user whos stake value is being looked up
@return is the uint amount of USDC value for all of a users staked ALR
**/
function getTotalStakeValue(address _usersAdd) public view returns(uint) {
  uint totalAmountStaked;

  for (uint i = 0; i < stakedALRs[_usersAdd].length; i++) {
           address _MMI = stakedALRs[_usersAdd][i];
           uint amountStaked = collateralized[_usersAdd][_MMI];
           UniswapOracleInstanceI oracle = UniswapOracleInstanceI(oracleTracker[_MMI]);
           uint usdPrice = oracle.consult(amountStaked);
           totalAmountStaked.add(usdPrice);
       }

       return totalAmountStaked;
}

/**
@notice addCollateral is used to add collateral to
@param _MMinstance is the address of the MoneyMarketInstance where the collateral is being added
@param _amount is the amount of asset being repayed
**/
  	function addCollateral(address _MMinstance, uint _amount) public {
      MoneyMarketInstance _MMI = MoneyMarketInstance(_MMinstance);
      AskoLowRisk _ALR = AskoLowRisk(_MMI.getALRadd());
      require(_ALR.balanceOf(msg.sender) >= _amount, "Insufficeint ALR balance for this asset");
      _MMI.factoryBurn(msg.sender, _amount);
      collateralized[msg.sender][_MMinstance] = collateralized[msg.sender][_MMinstance].add(_amount);
    }



/**
@notice _repay is an external function called by a MoneyMarketInstance to signify that a loan has been repayed by a user
@param _MMinstance is the address of the MoneyMarketInstance where the loan was payed off
@param _userAdd is the address of the user who payed this loan off
**/
    function _repay(address _MMinstance, address _userAdd) external {
      MoneyMarketInstance _MMI = MoneyMarketInstance(_MMinstance);
      uint _amount = collateralized[_userAdd][_MMinstance];
      _MMI.factoryMint(msg.sender, _amount);
      collateralized[_userAdd][_MMinstance] = 0;
    }

}
