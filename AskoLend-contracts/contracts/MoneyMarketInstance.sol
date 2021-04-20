pragma solidity 0.6.6;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "./compound/Exponential.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
import "./interfaces/MoneyMarketFactoryI.sol";
import "./interfaces/AskoRiskTokenI.sol";
import "./interfaces/ARTFactoryI.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketInstance
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The MoneyMarketInstance contract is designed facilitate a tiered money market for an individual ERC20 asset
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol, SafeMath.sol, ReentrancyGuard && SafeERC20.sol
**/
contract MoneyMarketInstance is Ownable, Exponential, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 public divisor;
    uint256 public collatRatio;
    address public ahr;
    address public alr;

    string public assetName;
    string public assetSymbol;

    IERC20 public asset;
    AskoRiskTokenI public AHR;
    AskoRiskTokenI public ALR;
    MoneyMarketFactoryI public MMF;
    UniswapOracleFactoryI public UOF;
    ARTFactoryI public ARTF;

    mapping(address => address) public collateralLockedALR;
    mapping(address => bool) public cantCollateralize;



    event LentToAHR(address lender, uint256 amount);
    event LentToALR(address lender, uint256 amount);
    event Borrow(address borrower, uint256 AHRamount, uint256 ALRamount);
    event Repayed(address borrower, uint256 AHRamount, uint256 ALRamount);
    event Collateralized(address collateralizer, uint256 amount);
    event Liquidated(
        address borrower,
        address liquidator,
        uint256 totalBorrowswETHval,
        address moneyMarket
    );
    event divisorUpdated(uint256 newDivisor);

    /**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to initialize the MoneyMakerInstance and deploy its associated AHR && ALR token contracts
@param _assetContractAdd is the address of the ERC20 asset being whitelisted
@param _oracleFactory is the address of the  oracle factory
@param _owner is the address of the MoneyMarketControl factory
@param _ARTF is the address of the ART Token Factory
@param _collatRatio is the number that will be used when calculating the collateralizastion ratio for a MMI
@param _assetName is the name of the asset(e.x: ChainLink)
@param _assetSymbol is the symbol of the asset(e.x: LINK)
**/
    constructor(
        address _assetContractAdd,
        address _oracleFactory,
        address _owner,
        address _ARTF,
        uint256 _collatRatio,
        string memory _assetName,
        string memory _assetSymbol
    ) public {
        divisor = 10000;
        assetName = _assetName;
        assetSymbol = _assetSymbol;
        collatRatio = _collatRatio;
        UOF = UniswapOracleFactoryI(_oracleFactory);
        MMF = MoneyMarketFactoryI(_owner);
        asset = IERC20(_assetContractAdd);
        ARTF = ARTFactoryI(_ARTF);
        transferOwnership(_owner);
    }

    ///////////////External Functions //////////////////

    /**
@notice setUp is called by the MoneyMarketFactory after a contract is created to set up the initial variables.
        This is split from the constructor function to keep from reaching the gas block limit
@param  _InterestRateModel is the address of this MoneyMarketInstances InterestRateModel
@param _initialExchangeRate is the initial exchange rate between an asset and its AHR token
@dev this function will create a token whos name and symbol is concatenated with a "AHR-" in front of it
      example: AHR-LINK
@dev asset.approve() is called to allow the AHR contract to freeely transfer the assset from this contract when the mint
      lendToAHRpool function is called.
@dev this function uses ABI encoding to properly concatenate AHR- && ALR- in front of the tokens name and symbol
      before creating each token.
**/
    function _setUpAHR(address _InterestRateModel, uint256 _initialExchangeRate)
        external
        onlyOwner
    {
        bytes memory ahrname = abi.encodePacked("AHR-");
        ahrname = abi.encodePacked(ahrname, assetName);
        //abi encode and concat strings
        bytes memory ahrsymbol = abi.encodePacked("AHR-");
        ahrsymbol = abi.encodePacked(ahrsymbol, assetSymbol);
        //abi encode and concat strings
        string memory assetNameAHR = string(ahrname);
        string memory assetSymbolAHR = string(ahrsymbol);
        //un-encode concated string
        AHR = AskoRiskTokenI(
            ARTF.createART( //creates new Asko High Risk Token Contract
                _InterestRateModel,
                address(asset),
                address(UOF),
                address(MMF),
                assetNameAHR,
                assetSymbolAHR,
                false,
                _initialExchangeRate
            )
        );
        ahr = address(AHR);
    }

    /**
@notice setUp is called by the MoneyMarketFactory after a contract is created to set up the initial variables.
        This is split from the constructor function to keep from reaching the gas block limit
@param  _InterestRateModel is the address of this MoneyMarketInstances InterestRateModel
@param _initialExchangeRate is the initial exchange rate between an asset and its ALR token
@dev this function will create a token whos name and symbol is concatenated with a "ALR-" in front of it
      example: ALR-LINK
@dev asset.approve() is called to allow the ALR contract to freeely transfer the assset from this contract when the mint
      lendToALRpool function is called.
@dev this function uses ABI encoding to properly concatenate AHR- && ALR- in front of the tokens name and symbol
      before creating each token.
**/
    function _setUpALR(address _InterestRateModel, uint256 _initialExchangeRate)
        external
        onlyOwner
    {
        bytes memory alrname = abi.encodePacked("AlR-");
        alrname = abi.encodePacked(alrname, assetName);
        //abi encode and concat strings
        bytes memory alrsymbol = abi.encodePacked("AlR-");
        alrsymbol = abi.encodePacked(alrsymbol, assetSymbol);
        //abi encode and concat strings
        string memory assetNameALR = string(alrname);
        string memory assetSymbolALR = string(alrsymbol);
        //un-encode concated string
        ALR = AskoRiskTokenI(
            ARTF.createART( //creates new Asko High Risk Token Contract
                _InterestRateModel,
                address(asset),
                address(UOF),
                address(MMF),
                assetNameALR,
                assetSymbolALR,
                true,
                _initialExchangeRate
            )
        );
        alr = address(ALR);
    }

    /**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's High Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
    function lendToAHRpool(uint256 _amount) external nonReentrant {
        //call mint function on AHR contract
        AHR.mint(msg.sender, _amount);
        //transfer appropriate amount off the asset from msg.sender to the AHR contract
        asset.safeTransferFrom(msg.sender, address(AHR), _amount);
        emit LentToAHR(msg.sender, _amount);
    }

    /**
@notice lendToALRpool is used to lend assets to a MoneyMarketInstance's Low Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
    function lendToALRpool(uint256 _amount) external nonReentrant {
        //call mint function on ALR contract
        ALR.mint(msg.sender, _amount);
        //transfer appropriate amount off the asset from msg.sender to the AHR contract
        asset.safeTransferFrom(msg.sender, address(ALR), _amount);
        emit LentToALR(msg.sender, _amount);
    }

    //struct used to avoid stack too deep errors
    struct borrowVars {
        uint256 borrowBalAHR;
        uint256 borrowBalALR;
        uint256 totalFutureAmountOwed;
        uint256 availibleCollateralValue;
        uint256 assetAmountValOwed;
        uint256 amountValue;
        uint256 halfVal;
        uint256 collateralNeeded;
        uint256 half;
    }

    /**
@notice borrow is used to take out a loan from in MoneyMarketInstance's underlying asset
@param _amount is the amount of asset being barrowed
@param _collateral is the address of the ALR token being used as collateral
**/
    function borrow(uint256 _amount, address _collateral)
        external
        nonReentrant
    {
        //require that the collateral a user is looking to use is the same as the type they already have a loan in
        //OR that their cantCollateralize mapping is false
        require(
            _collateral == collateralLockedALR[msg.sender] ||
                cantCollateralize[msg.sender] == false,
            "collateral not right"
        );
        require(_amount != 0, "amount cannot be equal to zero");
        borrowVars memory vars;
        //check that the user has enough collateral in input money market
        //this returns the wETH price of their asset

        //get current borrow balances for each ART
        vars.borrowBalAHR = AHR.borrowBalanceCurrent(msg.sender);
        vars.borrowBalALR = ALR.borrowBalanceCurrent(msg.sender);
        //calculate the new amount that would be owed if borrow suceeds
        vars.totalFutureAmountOwed = vars.borrowBalAHR.add(
            vars.borrowBalALR.add(_amount)
        );
        //check current asset wETH value of whats owed
        vars.assetAmountValOwed = UOF.getUnderlyingPriceofAsset(
            address(asset),
            vars.totalFutureAmountOwed
        );
        //get wETH value of _amount
        vars.amountValue = UOF.getUnderlyingPriceofAsset(
            address(asset),
            _amount
        );
        //get wETH value of availible collateral
        vars.availibleCollateralValue = MMF.checkAvailibleCollateralValue(
            msg.sender,
            _collateral
        );

        //divide amount value by collatRatio
        vars.halfVal = vars.assetAmountValOwed.div(collatRatio);
        //add collatRatio of value to asset value to get the right ratio asset value
        vars.collateralNeeded = vars.assetAmountValOwed.add(vars.halfVal);
        //require collateral value to be greater than collatRatio of the amount value of loan
        require(
            vars.availibleCollateralValue >= vars.collateralNeeded,
            "not enough collateral"
        );
        //track wETH value being locked for the loan
        MMF.trackCollateralUp(msg.sender, _collateral, vars.collateralNeeded, vars.amountValue);
        //cut amount of tokens in half
        vars.half = _amount.div(2);

        //track which ALR is locked
        collateralLockedALR[msg.sender] = _collateral;
        cantCollateralize[msg.sender] = true;
        //borrow half from each pool
        AHR.borrow(vars.half, msg.sender);
        ALR.borrow(vars.half, msg.sender);
        emit Borrow(msg.sender, vars.half, vars.half);
    }

    /**
@notice repay is used to repay a loan
@param _repayAmount is the amount of the underlying asset being repayed
**/
    function repay(uint256 _repayAmount) external nonReentrant {
        //get their current owed balance of ALR
        uint256 accountBorrowsALR = ALR.borrowBalanceCurrent(msg.sender);
        uint256 accountBorrowsAHR = AHR.borrowBalanceCurrent(msg.sender);
        uint256 totalBorrows = accountBorrowsALR.add(accountBorrowsAHR);
        require(_repayAmount <= totalBorrows, "Repaying too much");
        uint256 payAmountAHR;
        uint256 payAmountALR;

        ///////////////repay all///////////////
        if (_repayAmount == 0) {
            if (accountBorrowsALR != 0) {
              payAmountALR = ALR.repayBorrow(accountBorrowsALR, msg.sender); // repay amount to ALR
                asset.safeTransferFrom(
                    msg.sender,
                    address(ALR),
                    accountBorrowsALR
                );
            }
            require(accountBorrowsAHR > 0, "There is nothing to repay on this account");
            payAmountAHR = AHR.repayBorrow(accountBorrowsAHR, msg.sender); //pay off towards AHR
            asset.safeTransferFrom(
              msg.sender,
              address(AHR),
              accountBorrowsAHR
            );
            ///get wETH value of what was repayed
            uint256 _wETHvalRepayed =
                UOF.getUnderlyingPriceofAsset(address(asset), totalBorrows);
            ////track repayment in MMC
            MMF.trackCollateralDown(
                msg.sender,
                collateralLockedALR[msg.sender],
                _wETHvalRepayed
            );
            emit Repayed(msg.sender, accountBorrowsAHR, accountBorrowsALR);
        } else {
            ///////////////repay ALR///////////////////
            if (accountBorrowsALR != 0) {
                //if amount owed to ALR isnt zero
                if (accountBorrowsALR >= _repayAmount) {
                    //if repay amount is less than whats owed in ALR
                    //transfer asset from the user to the ALR contract
                    payAmountALR = ALR.repayBorrow(_repayAmount, msg.sender); // repay amount to ALR
                    asset.safeTransferFrom(
                      msg.sender,
                      address(ALR),
                      _repayAmount
                    );

                    emit Repayed(msg.sender, 0, _repayAmount);
                } else {
                    ///////////////repay all of ALR && some AHR///////////////////
                    //if repay amount is MORE than ALR owed
                    uint256 amountToAHR = _repayAmount.sub(accountBorrowsALR); //calculate amount going to AHR
                     //transfer remaining ALR bal to ALR
                    payAmountALR = ALR.repayBorrow(0, msg.sender); //pay off ALR
                    asset.safeTransferFrom(
                      msg.sender,
                      address(ALR),
                      accountBorrowsALR
                    );
                    payAmountAHR = AHR.repayBorrow(amountToAHR, msg.sender); //pay off towards AHR
                    asset.safeTransferFrom(
                      msg.sender,
                      address(AHR),
                      amountToAHR
                    ); // transfer remaining payment amount to AHR
                    //if payAmountAHR is greater than 0 transfer asset from the user to the AHR contract
                    emit Repayed(msg.sender, payAmountAHR, payAmountALR);
                }
            } else {
                //if amount owed to ALR is zero
                //transfer asset from the user to the AHR contract
                payAmountAHR = AHR.repayBorrow(_repayAmount, msg.sender); //pay towards AHR
                asset.safeTransferFrom(msg.sender, address(AHR), _repayAmount);
                emit Repayed(msg.sender, payAmountAHR, 0);
            }
        }


        //////////////fully repayed logic/////////////
        if (
            accountBorrowsAHR.sub(payAmountAHR) == 0 &&
            accountBorrowsALR.sub(payAmountALR) == 0
        ) {
            //if the loan is fully payed off
            //unlock the users locked collateral for this loan

            //reset collateralLockedALR address to zero so the user can use a different ALR address in future borrows with this MMI
            collateralLockedALR[msg.sender] = address(0);
            cantCollateralize[msg.sender] = false;
        }
    }

    //struct used to avoid stack too deep errors
    struct liquidateLocalVar {
        uint256 accountBorrowsALR;
        uint256 accountBorrowsAHR;
        uint256 totalBorrows;
        uint256 borrowedValue;
        uint256 borrowedValuecollatRatio;
        uint256 collatValue;
        uint256 halfVal;
        uint256 payAmountALR; // Note: reverts on error
        uint256 payAmountAHR;
    }

    /**
    @notice _liquidateFor is called by the liquidateAccount function on a MMI where a user is being liquidated. This function
            is called on a MMI contract where collateral is staked.
            @param _borrower is the address of the borrower account who is non compliant
            @param _ARTcollateralized is the address of the ALR Token contract used as collateral
    **/
    function liquidateAccount(
        address _borrower,
        AskoRiskTokenI _ARTcollateralized
    ) external {
        //create local vars storage
        liquidateLocalVar memory vars;
        require(msg.sender != _borrower, "you cant liquidate yourself");
        //get current borrowed amount
        uint256 accountBorrowsALR = ALR.borrowBalanceCurrent(_borrower);
        uint256 accountBorrowsAHR = AHR.borrowBalanceCurrent(_borrower);
        uint256 totalBorrows = accountBorrowsALR.add(accountBorrowsAHR); //666 augur total

        //get wETH value of borrowed value
        vars.borrowedValue = UOF.getUnderlyingPriceofAsset(
            address(asset),
            totalBorrows
        );
        //get wETH collateral value
        vars.collatValue = MMF.checkCollateralizedALR(
            _borrower,
            address(_ARTcollateralized)
        );
        //divide borrowedValue by collatRatio
        vars.halfVal = vars.borrowedValue.div(collatRatio);
        //add collatRatio of the borrowedValue value to the total borrowedValue value for correct collateral amount
        vars.borrowedValuecollatRatio = vars.borrowedValue.add(vars.halfVal);
        /**
      need to check if the amount of collateral is less than borrowedValuecollatRatio of the borrowed amount
      if the collateral value is greater than or equal to borrowedValuecollatRatio of the borrowed value than we dont liquidate
      **/
        require(
            vars.collatValue <= vars.borrowedValuecollatRatio,
            "Account is compliant cannot liquidate"
        );
        //call MoneyMarketControl which will track values and call the ART token for the swap
        MMF.liquidateTrigger(
            vars.collatValue,
            _borrower,
            address(this),
            address(asset),
            address(_ARTcollateralized)
        );
        //Half the returned asset amount and send half to each ART contract
        uint256 totalEarned = asset.balanceOf(address(this));
        uint remaining = totalEarned.sub(totalBorrows);
        asset.safeTransfer(address(ALR), accountBorrowsALR);
        asset.safeTransfer(address(AHR), accountBorrowsAHR);
        asset.safeTransfer(msg.sender, remaining);
        vars.payAmountALR = ALR.repayBorrow(0, _borrower); //pay off ALR for borrower
        vars.payAmountAHR = AHR.repayBorrow(0, _borrower); //pay off  AHR for borrower
        //Emit the Event
        emit Liquidated(
            _borrower,
            msg.sender,
            vars.borrowedValue,
            address(this)
        );
    }

    /**
    @notice these are admin functions for updating individual ART values. All of these functions are protected
    and can only be called by the MoneyMarketControl contract. These functions can be considered as Internal functions to the platform.
    **/
    function updateALR(address _newModel) external onlyOwner {
        ALR._updateInterestModel(_newModel);
    }

    function updateAHR(address _newModel) external onlyOwner {
        AHR._updateInterestModel(_newModel);
    }

    function setRRAHR(uint256 _RR) external onlyOwner {
        AHR.setReserveRatio(_RR);
    }

    function setRRALR(uint256 _RR) external onlyOwner {
        ALR.setReserveRatio(_RR);
    }

    function updateDivisor(uint256 _NewD) external onlyOwner {
        divisor = _NewD;
        emit divisorUpdated(_NewD);
    }

    function _upgradeMMIOracle(address _newOracle) external onlyOwner {
        UOF = UniswapOracleFactoryI(_newOracle);
        ALR._updateOracle(_newOracle);
        AHR._updateOracle(_newOracle);
    }

    function upgradeMoneyMarketFactory(address _newMMF) external onlyOwner {
        MMF = MoneyMarketFactoryI(_newMMF);
    }

    function _collectFees(address _targetAdd) external onlyOwner {
        AHR._withdrawFee(_targetAdd);
        ALR._withdrawFee(_targetAdd);
    }

    function _changeColatRatio(uint256 _newCR) external onlyOwner {
        collatRatio = _newCR;
    }

    //////////////////View Functions/////////////////
    /**
    @notice getAssetAdd allows for easy retrieval of a Money Markets underlying asset's address
    **/
    function getAssetAdd() external view returns (address) {
        return address(asset);
    }

    function checkIfALR(address _inQuestion) external view returns (bool) {
        return MMF._checkIfALR(_inQuestion);
    }
}
