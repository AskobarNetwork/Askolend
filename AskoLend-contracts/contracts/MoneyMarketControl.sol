pragma solidity 0.6.6;

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
  Ownable.sol && SafeMath.sol
**/

contract MoneyMarketControl is Ownable, Exponential {
    using SafeMath for uint256;

    uint256 public instanceCount; //tracks the number of instances
    uint256 public feeTracker;
    uint256 public costOfOneWithdraw;
    address public ARTF;
    UniswapOracleFactoryI public Oracle; //oracle factory contract interface
    MoneyMarketFactoryI public MMF;

    address[] public assets;

    mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance
    mapping(address => address) public _ALRtracker; // tracks a money markets address to its ALR token.
    mapping(address => address) public oracleTracker; //maps a MM oracle to its Money market address
    mapping(address => mapping(address => uint256)) public collateralTracker; //tracks user to a market to an amount collaterlized in that market
    mapping(address => mapping(address => uint256)) public actualAmountBorrowed; //tracks user to a market to an amount collaterlized in that market
    mapping(address => bool) public isMMI;
    mapping(address => bool) public isALR;

    /**
  @notice onlyMMFactory is a modifier used to make a function only callable by the Money Market Instance contract
  **/
    modifier onlyMMI() {
        require(isMMI[msg.sender], "msg.sender is not a Money Market Instance");
        _;
    }

    event WhiteListed(address asset, address moneyMarket, address oracle);
    event AHRcreated(address asset, address interestRateModel);
    event ALRcreated(address asset, address interestRateModel);
    event CollateralUp(address ALR, address borrower, uint256 _amount);
    event CollateralDown(address ALR, address borrower, uint256 _amount);
    event InterestRateModelUpdate(
        uint256 baseRatePerYear,
        uint256 multiplierPerYear,
        uint256 jumpMultiplierPerYear,
        uint256 optimal,
        address assetContractAdd,
        address moneyMarketInstance
    );
    event ReserveRateUpdate(
        bool isALR,
        address asset,
        address moneyMarketInstance,
        uint256 newRR
    );
    event OracleUpgrade(address newOracle);
    event NewMoneyMarketFactory(address newMMFactory);
    event NewArtFactory(address newARTFactory);
    event MMIOracleUpgrade(address MonetMarketInstance);

    /**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to set up Oracle variables for the MoneyMarketFactory contract.
@param _oracle is the address for the UniswapOracleFactorycontract
@param _MMF is the address of the MoneyMarketFactory contract
@param _ARTF is the address of the ART factory contract
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

    ///////////External Functions/////////////////
    /**
@notice whitelistAsset is an onlyOwner function designed to be called by the AskoDAO.
        This function creates a new MoneyMarketInstancecontract for an input asset as well
        as a UniswapOracleInstance for the asset.
@param _assetContractAdd is the address of the ERC20 asset being whitelisted
@param _collatRatio is the number that will be used when calculating the collateralizastion ratio for a MMI
@param _assetName is the name of the asset(e.x: ChainLink)
@param _assetSymbol is the symbol of the asset(e.x: LINK)
**/
    function whitelistAsset(
        address _assetContractAdd,
        uint256 _collatRatio,
        string calldata _assetName,
        string calldata _assetSymbol
    ) external onlyOwner {
        instanceCount++;
        address oracle = address(Oracle.createNewOracle(_assetContractAdd));
        address _MMinstance =
            MMF.createMMI(
                _assetContractAdd,
                address(Oracle),
                address(this),
                ARTF,
                _collatRatio,
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
@param _assetContractAdd is the contract address of the asset whos MoneyMarketInstance is being set up
@dev this function can only be called after an asset has been whitelisted as it needs an existing MoneyMarketInstance contract
**/
    function setUpAHR(
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        uint256 _initialExchangeRate,
        address _assetContractAdd
    ) external onlyOwner {
        require(
            isMMI[instanceTracker[_assetContractAdd]],
            "Input asset address doesnt have an MMI"
        );
        MoneyMarketInstanceI _MMI =
            MoneyMarketInstanceI(instanceTracker[_assetContractAdd]);

        address interestRateModel =
            address(
                new JumpRateModelV2(
                    _baseRatePerYear,
                    _multiplierPerYear,
                    _jumpMultiplierPerYear,
                    _optimal,
                    address(_MMI)
                )
            );

        _MMI._setUpAHR(interestRateModel, _initialExchangeRate);

        emit AHRcreated(_assetContractAdd, interestRateModel);
    }

    /**
@notice setUpAHR is used to set up a MoneyMarketInstances Asko High Risk Token as well as its InterestRateModel
@param _baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)
@param _multiplierPerYear  The rate of increase in interest rate wrt utilization (scaled by 1e18)
@param _jumpMultiplierPerYear The multiplierPerBlock after hitting a specified utilization point
@param _optimal The utilization point at which the jump multiplier is applied(Refered to as the Kink in the InterestRateModel)
@param _assetContractAdd is the contract address of the asset whos MoneyMarketInstance is being set up
@dev this function can only be called after an asset has been whitelisted as it needs an existing MoneyMarketInstance contract
**/
    function setUpALR(
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        uint256 _initialExchangeRate,
        address _assetContractAdd
    ) external onlyOwner {
        require(
            isMMI[instanceTracker[_assetContractAdd]],
            "Input asset address doesnt have an MMI"
        );
        MoneyMarketInstanceI _MMI =
            MoneyMarketInstanceI(instanceTracker[_assetContractAdd]);

        address interestRateModel =
            address(
                new JumpRateModelV2(
                    _baseRatePerYear,
                    _multiplierPerYear,
                    _jumpMultiplierPerYear,
                    _optimal,
                    address(_MMI)
                )
            );
        _MMI._setUpALR(interestRateModel, _initialExchangeRate);
        _ALRtracker[_MMI.ALR()] = address(_MMI);
        isALR[_MMI.ALR()] = true;

        emit ALRcreated(_assetContractAdd, interestRateModel);
    }

    /**
@notice trackCollateralUp is an external function used bya MMI to track collateral amounts globally
@param _borrower is the address of the corrower
@param _ALR is the address of the ALR being collateralized
@param _amount is the amount of wETH being collateralized
@dev this function can only be called by a MoneyMarketInstance.
**/
    function trackCollateralUp(
        address _borrower,
        address _ALR,
        uint256 _amount,
        uint256 _amountBorrowed
    ) external onlyMMI {
        require(isALR[_ALR], "Input ALR address is not an ALR contract");
        collateralTracker[_borrower][_ALR] = collateralTracker[_borrower][_ALR]
            .add(_amount);
        actualAmountBorrowed[_borrower][_ALR] = collateralTracker[_borrower][
            _ALR
        ]
            .add(_amountBorrowed);
        AskoRiskTokenI alr = AskoRiskTokenI(_ALR);
        alr.burn(_borrower, _amount);
        emit CollateralUp(_ALR, _borrower, _amount);
    }

    /**
 @notice trackCollateralDown is an external function used bya MMI to track collateral amounts globally
 @param _ALR is the address of the ALR being collateralized
 @param _ALR is the address of the seller
 @param _amount is the amount of wETH being collateralized
 @dev this function can only be called by a MoneyMarketInstance.
 **/
    function trackCollateralDown(
        address _borrower,
        address _ALR,
        uint256 _amount
    ) external onlyMMI {
        require(isMMI[msg.sender] || isALR[msg.sender], "not a asko contract");
        require(isALR[_ALR], "Input ALR address is not an ALR contract");
        AskoRiskTokenI alr = AskoRiskTokenI(_ALR);
        alr.mintCollat(_borrower, collateralTracker[_borrower][_ALR]);
        collateralTracker[_borrower][_ALR] = 0;
        actualAmountBorrowed[_borrower][_ALR] = 0;
        emit CollateralDown(_ALR, _borrower, _amount);
    }

    /**
@notice checkCollateralValue  accepts an account address and an ALR contract
        address and returns the USD value of the availible collateral they have. Availible collateral is
        determined by the total amount of collateral minus the amount of collateral that is still availible to borrow against
@param _borrower is the address whos collateral value we are looking up
@param _ALR is the address of the ALR token where collateral value is being looked up
@dev this function calls the accrueInterest function when called and is therefore not a view function
 **/
    function checkAvailibleCollateralValue(address _borrower, address _ALR)
        external
        returns (uint256)
    {
        //instantiate art token
        AskoRiskTokenI _ART = AskoRiskTokenI(_ALR);
        //get borrowers art balance
        uint256 artBal = _ART.balanceOf(_borrower);
        //get wETH value of art balance
        return _ART.getwETHWorthOfART(artBal);
    }

    /**
@notice liquidateTrigger is a protected function that can only be called by a money market instance.
@param _liquidateValue is the wETH value being liquidated
@param _borrower is the address of the account being liquidated
@param _liquidator is the address of the account doing the liquidating
@param _ALR is the address of the Asko Low Risk token that was used as collateral
**/
    function liquidateTrigger(
        uint256 _liquidateValue,
        address _borrower,
        address _liquidator,
        address _asset,
        AskoRiskTokenI _ALR
    ) external onlyMMI {
        require(
            isALR[address(_ALR)],
            "Input ALR address is not an ALR contract"
        );
        _ALR._liquidate(_liquidateValue, _liquidator, _asset, _borrower);
        collateralTracker[_borrower][address(_ALR)] = 0;
    }

    /**
@notice updateIRM allows the admin of this contract to update a AskoRiskToken's Interest Rate Model
@param _baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)
@param _multiplierPerYear  The rate of increase in interest rate wrt utilization (scaled by 1e18)
@param _jumpMultiplierPerYear The multiplierPerBlock after hitting a specified utilization point
@param _optimal The utilization point at which the jump multiplier is applied(Refered to as the Kink in the InterestRateModel)
@param _assetContractAdd is the contract address of the asset whos MoneyMarketInstance is being set up
@param _isALR is a bool representing whether or not the Asko risk token being updated is a ALR or not
**/
    function updateIRM(
        uint256 _baseRatePerYear,
        uint256 _multiplierPerYear,
        uint256 _jumpMultiplierPerYear,
        uint256 _optimal,
        address _assetContractAdd,
        bool _isALR
    ) external onlyOwner {
        require(
            isMMI[instanceTracker[_assetContractAdd]],
            "Input asset address doesnt have an MMI"
        );
        MoneyMarketInstanceI _MMI =
            MoneyMarketInstanceI(instanceTracker[_assetContractAdd]);

        address interestRateModel =
            address(
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

        emit InterestRateModelUpdate(
            _baseRatePerYear,
            _multiplierPerYear,
            _jumpMultiplierPerYear,
            _optimal,
            _assetContractAdd,
            address(_MMI)
        );
    }

    /**
@notice updateRR allows the admin to update the reserve ratio for an Asko Risk Token
@param _newRR is the new reserve ratio value(scaled by 1e18)
@param _isALR is a bool representing whether of not the Reserve ratio being updated iis an ALR or not
@param _asset is the address of the asset(token) whos ART tokens are being updated
**/
    function updateRR(
        uint256 _newRR,
        bool _isALR,
        address _asset
    ) external onlyOwner {
        require(
            isMMI[instanceTracker[_asset]],
            "Input asset address doesnt have an MMI"
        );
        MoneyMarketInstanceI _MMI =
            MoneyMarketInstanceI(instanceTracker[_asset]);
        if (_isALR) {
            _MMI.setRRALR(_newRR);
        } else {
            _MMI.setRRAHR(_newRR);
        }
        emit ReserveRateUpdate(_isALR, _asset, address(_MMI), _newRR);
    }

    /**
@notice upgradeOracle allows the contract owner to update the oracle factory address
@param _newOracle is the address of the new oracle factory contract.
**/
    function upgradeOracle(address _newOracle) external onlyOwner {
        Oracle = UniswapOracleFactoryI(_newOracle);
        emit OracleUpgrade(_newOracle);
    }

    /**
v@notice upgradeMoneyMarketFactory allows the contract owner to update the Money Market factory address
@param _newMMF is the address of the new Money Market factory contract.
**/
    function upgradeMoneyMarketFactory(address _newMMF) external onlyOwner {
        MMF = MoneyMarketFactoryI(_newMMF);
        emit NewMoneyMarketFactory(_newMMF);
    }

    /**
@notice upgradeARTFactory allows the contract owner to update the ART Factory address
@param _ARTF is the address of the new ART factory contract.
**/
    function upgradeARTFactory(address _ARTF) external onlyOwner {
        ARTF = _ARTF;
        emit NewArtFactory(_ARTF);
    }

    /**
@notice upgradeMMIOracle allows the owner of the Money Market Control contract to update the oracle
        factory contract that a Money Market instance points to
@param _asset is the address of the asset the MoneyMarketInstance controls
**/
    function upgradeMMIOracle(address _asset) external onlyOwner {
        MoneyMarketInstanceI _MMI =
            MoneyMarketInstanceI(instanceTracker[_asset]);
        _MMI._upgradeMMIOracle(address(Oracle));
        emit MMIOracleUpgrade(address(_MMI));
    }

    /**
    @notice collectFees allows the owner of the MMC to withdraw the earned fees from All MMI's
    @param _targetAdd is the address the fees will be sent to
    **/
    function collectFees(address _targetAdd) external onlyOwner {
        //get starting availible gas
        uint256 start = gasleft();
        //If the feeTracker is set to zero
        if (feeTracker == 0) {
            //instantiate the MoneyMarketInstance in position zero of the assets array
            MoneyMarketInstanceI MMI =
                MoneyMarketInstanceI(instanceTracker[assets[0]]);
            //collect fees
            MMI._collectFees(_targetAdd);
            //record the gas cost of collecting the fees
            costOfOneWithdraw = start.sub(gasleft());
        }
        uint256 length = assets.length;
        //loop through each remaining MoneyMarketInstance
        feeTracker++;
        for (uint256 x = feeTracker; feeTracker <= length; x++) {
            //while the amount of gas allows it
            while (gasleft() > costOfOneWithdraw.mul(2)) {
                //instantiate the MoneyMarketInstance
                MoneyMarketInstanceI MMI =
                    MoneyMarketInstanceI(instanceTracker[assets[x]]);
                //collect fees from it
                MMI._collectFees(_targetAdd);
            }
            // if the fee tracker is equal to the number of MMI's
            if (feeTracker == length) {
                //set it to zero
                feeTracker = 0;
                //if not
            } else {
                //track which MMI the loop is on
                feeTracker = x;
            }
        }
    }

    /**
@notice changeColateRatio allows the owner of this contract to change the collateral ratio for an asset
@param _asset is the address of the asset whos MoneyMarket is being updated
@param _newCR is the new collatRatio being set
**/
    function changeColateRatio(address _asset, uint256 _newCR)
        external
        onlyOwner
    {
        MoneyMarketInstanceI MMI =
            MoneyMarketInstanceI(instanceTracker[_asset]);
        MMI._changeColatRatio(_newCR);
    }

    /**
@notice setLiquidationBot allows the admin account to set the address of the liquidation bot on an individual MMI
@param asset is the address of the asset whos MoneyMarket is being updated
@param _bot is the address of the liquidation bot
*/
    function setLiquidationBot(address _asset, address _bot)
        external
        onlyOwner
    {
        MoneyMarketInstanceI MMI =
            MoneyMarketInstanceI(instanceTracker[_asset]);
        MMI.setLiquidationBot(_bot);
    }

    ///////////View Functions/////////////////////////
    /**
    @notice viewAvailibleCollateralValue is a view function that accepts an account address and an ALR contract
    address and returns the wETH value of the availible collateral they have.
    @param _borrower is the address whos collateral value we are looking up
    @param _ALR is the address of the ALR token where collateral value is being looked up
    **/
    function viewAvailibleCollateralValue(address _borrower, address _ALR)
        external
        view
        returns (uint256)
    {
        //instantiate art token
        AskoRiskTokenI _ART = AskoRiskTokenI(_ALR);
        //get borrowers art balance
        uint256 artBal = _ART.balanceOf(_borrower);
        //get wETH value of art balance
        return _ART.viewwETHWorthOfART(artBal);
    }

    /**
    @notice getAsset returns an array of all assets whitelisted on the platform.
    @dev this can be used to loop through and retreive each assets MoneyMarket by the front end
    **/
    function getAssets() external view returns (address[] memory) {
        return assets;
    }

    /**
    @notice checkCollateralizedALR is used by the front end to check a borrowers collateralized ALR amount
    @param _borrower is the address of the borrower
    @param _ALR is the address of the ALR being used as collateral
    **/
    function checkCollateralizedALR(address _borrower, address _ALR)
        external
        view
        returns (uint256)
    {
        return collateralTracker[_borrower][_ALR];
    }

    /**
    @notice _checkIfALR is used to check if an input address is an ALR contract
    @param __inQ is the address in question
    **/

    function _checkIfALR(address __inQ) external view returns (bool) {
        return isALR[__inQ];
    }
}
