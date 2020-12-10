pragma solidity ^0.6.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./MoneyMarketInstance.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
import "./interfaces/MoneyMarketFactoryI.sol";
import "./interfaces/MoneyMarketInstanceI.sol";
import "./interfaces/AskoRiskTokenI.sol";
import "./compound/JumpRateModelV2.sol";
import "./compound/Exponential.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
MoneyMarketControl is designed to coordinate Money Markets
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract MoneyMarketControl is Ownable, Exponential {
    using SafeMath for uint256;

    uint256 public instanceCount; //tracks the number of instances
    address public ARTF;
    UniswapOracleFactoryI public Oracle; //oracle factory contract interface
    MoneyMarketFactoryI public MMF;

    address[] public assets;

    mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance
    mapping(address => address) public _ALRtracker; // tracks a money markets address to its ALR token.
    mapping(address => address) public oracleTracker; //maps a MM oracle to its Money market address
    mapping(address => mapping(address => uint256)) collateralTracker; //tracks user to a market to an amount collaterlized in that market
    mapping(address => bool) isMMI;
    mapping(address => bool) isALR;

    /**
  @notice onlyMMFactory is a modifier used to make a function only callable by the Money Market Instance contract
  **/
    modifier onlyMMI() {
        require(isMMI[msg.sender] == true);
        _;
    }

    event WhiteListed(address asset, address moneyMarket, address oracle);
    event AHRcreated(address asset, address interestRateModel);
    event ALRcreated(address asset, address interestRateModel);

    /**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to set up Oracle variables for the MoneyMarketFactory contract.
@param _oracle is the address for the UniswapOracleFactorycontract
**/
    constructor(
        address _oracle,
        address _MMF,
        address _ARTF
    ) public {
        Oracle = UniswapOracleFactoryI(_oracle);
        MMF = MoneyMarketFactoryI(_MMF);
        ARTF = _ARTF;
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
    ) public onlyOwner {
        instanceCount++;

        address oracle = address(Oracle.createNewOracle(_assetContractAdd));

        address _MMinstance = MMF.createMMI(
            _assetContractAdd,
            address(Oracle),
            address(this),
            ARTF,
            _assetName,
            _assetSymbol
        );

        isMMI[_MMinstance] = true;
        Oracle.linkMMI(_MMinstance, _assetContractAdd);
        instanceTracker[_assetContractAdd] = _MMinstance;
        oracleTracker[_MMinstance] = oracle;
        assets.push(_assetContractAdd);
        emit WhiteListed(_assetContractAdd, _MMinstance, oracle);
    }

    /**
@notice setUpAHR is used to set up a MoneyMarketInstances Asko High Risk Token as well as its InterestRateModel
@param _baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)
@param _multiplierPerYear  The rate of increase in interest rate wrt utilization (scaled by 1e18)
@param _jumpMultiplierPerYear The multiplierPerBlock after hitting a specified utilization point
@param _optimal The utilization point at which the jump multiplier is applied(Refered to as the Kink in the InterestRateModel)
@param _fee is a number representing the fee for exchanging an AHR token, as a mantissa (scaled by 1e18)
@param _assetContractAdd is the contract address of the asset whos MoneyMarketInstance is being set up
@dev this function can only be called after an asset has been whitelisted as it needs an existing MoneyMarketInstance contract
**/
    function setUpAHR(
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        uint256 _fee,
        uint256 _initialExchangeRate,
        address _assetContractAdd
    ) public {
        MoneyMarketInstanceI _MMI = MoneyMarketInstanceI(
            instanceTracker[_assetContractAdd]
        );

        address interestRateModel = address(
            new JumpRateModelV2(
                _baseRatePerYear,
                _multiplierPerYear,
                _jumpMultiplierPerYear,
                _optimal,
                address(_MMI)
            )
        );

        _MMI._setUpAHR(interestRateModel, _fee, _initialExchangeRate);

        emit AHRcreated(_assetContractAdd, interestRateModel);
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
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        uint256 _fee,
        uint256 _initialExchangeRate,
        address _assetContractAdd
    ) public {
        MoneyMarketInstanceI _MMI = MoneyMarketInstanceI(
            instanceTracker[_assetContractAdd]
        );

        address interestRateModel = address(
            new JumpRateModelV2(
                _baseRatePerYear,
                _multiplierPerYear,
                _jumpMultiplierPerYear,
                _optimal,
                address(_MMI)
            )
        );
        isALR[address(_MMI)] = true;
        _MMI._setUpALR(interestRateModel, _fee, _initialExchangeRate);
        _ALRtracker[_MMI.ALR()] = address(_MMI);

        emit ALRcreated(_assetContractAdd, interestRateModel);
    }

    /**
@notice getAsset returns an array of all assets whitelisted on the platform.
@dev this can be used to loop through and retreive each assets MoneyMarket by the front end
**/
    function getAssets() public view returns (address[] memory) {
        return assets;
    }

    /**
@notice trackCollateralUp is an external function used bya MMI to track collateral amounts globally
@param _borrower is the address of the corrower
@param _ALR is the address of the seller
@param _amount is the amount of USDC being collateralized
@dev this function can only be called by a MoneyMarketInstance.
**/
    function trackCollateralUp(
        address _borrower,
        address _ALR,
        uint256 _amount
    ) external onlyMMI {
        require(isMMI[msg.sender] || isALR[msg.sender], "not a asko contract");
        collateralTracker[_borrower][_ALR] = collateralTracker[_borrower][_ALR]
            .add(_amount);
    }

    /**
 @notice trackCollateralDown is an external function used bya MMI to track collateral amounts globally
 @param _borrower is the address of the corrower
 @param _ALR is the address of the seller
 @param _amount is the amount of USDC being collateralized
 @dev this function can only be called by a MoneyMarketInstance.
 **/
    function trackCollateralDown(
        address _borrower,
        address _ALR,
        uint256 _amount
    ) external onlyMMI {
        require(isMMI[msg.sender] || isALR[msg.sender], "not a asko contract");
        if (collateralTracker[_borrower][_ALR] > _amount) {
            collateralTracker[_borrower][_ALR] = collateralTracker[_borrower][_ALR]
                .sub(_amount);
        } else {
            collateralTracker[_borrower][_ALR] = 0;
        }
    }

    function checkCollateralizedALR(address _borrower, address _ALR)
        public
        view
        returns (uint256)
    {
        return collateralTracker[_borrower][_ALR];
    }

    /**
@notice checkCollateralValue is a view function that accepts an account address and an ALR contract
        address and returns the USD value of the availible collateral they have. Availible collateral is
        determined by the total amount of collateral minus the amount of collateral that is still availible to borrow against
@param _borrower is the address whos collateral value we are looking up
@param _ALR is the address of the ALR token where collateral value is being looked up
 **/
    function checkAvailibleCollateralValue(address _borrower, address _ALR)
        external
        returns (uint256)
    {
        //instantiate art token
        AskoRiskTokenI _ART = AskoRiskTokenI(_ALR);
        //get borrowers art balance
        uint256 artBal = _ART.balanceOf(_borrower);
        //get USDC value of art balance
        uint256 usdcValOfBalance = _ART.getUSDCWorthOfART(artBal);
        //retrieve the amount of the USDC value they have borrowed
        uint256 usdcValLocked = collateralTracker[_borrower][_ALR];
        //retrieve USDC availible collateral
        return usdcValOfBalance.sub(usdcValLocked);
    }

    function _checkIfALR(address __inQ) external view returns (bool) {
        return isALR[__inQ];
    }

    /**
tells you the USDC value of their locked ALR
**/
    function viewCollateral(address _account, address _alr)
        public
        view
        returns (uint256)
    {
        return collateralTracker[_account][_alr];
    }

    function liquidateTrigger(
        uint256 _liquidateValue,
        address _borrower,
        address _liquidator,
        AskoRiskTokenI _ALR
    ) public onlyMMI {
        collateralTracker[_borrower][address(_ALR)] = 0;
        _ALR._liquidate(_liquidateValue, _borrower, _liquidator);
    }

    function updateIRM(
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        address _assetContractAdd,
        bool _isALR
    ) public {
        MoneyMarketInstanceI _MMI = MoneyMarketInstanceI(
            instanceTracker[_assetContractAdd]
        );

        address interestRateModel = address(
            new JumpRateModelV2(
                _baseRatePerYear,
                _multiplierPerYear,
                _jumpMultiplierPerYear,
                _optimal,
                address(_MMI)
            )
        );
        if (_isALR) {
            _MMI.updateALR(interestRateModel);
        } else {
            _MMI.updateAHR(interestRateModel);
        }
    }

    function updateRR(
        uint256 _newRR,
        bool _isALR,
        address _asset
    ) public onlyMMI {
        MoneyMarketInstanceI _MMI = MoneyMarketInstanceI(
            instanceTracker[_asset]
        );
        if (_isALR) {
            _MMI.setRRALR(_newRR);
        } else {
            _MMI.setRRAHR(_newRR);
        }
    }
}
