pragma solidity ^0.6.0;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
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
  Ownable.sol && IRC20.sol
**/
contract MoneyMarketInstance is Ownable, Exponential {
    using SafeMath for uint256;

    uint256 public divisor;
    uint256 public fee_AHR;
    uint256 public fee_ALR;
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

    mapping(address => uint256) lockedCollateral;
    mapping(address => address) collateralLockedALR;
    mapping(address => bool) cantCollateralize;
    /**
@notice onlyMMFactory is a modifier used to make a function only callable by the Money Market Factory contract
**/
    modifier onlyMMFactory() {
        require(msg.sender == address(MMF));
        _;
    }

    event LentToAHR(address lender, uint256 amount);
    event LentToALR(address lender, uint256 amount);
    event Borrow(address borrower, uint256 AHRamount, uint256 ALRamount);
    event Repayed(address borrower, uint256 AHRamount, uint256 ALRamount);
    event Collateralized(address collateralizer, uint256 amount);

    /**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
        is used to initialize the MoneyMakerInstance and deploy its associated AHR && ALR token contracts
@param _assetContractAdd is the address of the ERC20 asset being whitelisted
@param _assetName is the name of the asset(e.x: ChainLink)
@param _assetSymbol is the symbol of the asset(e.x: LINK)
@dev this function uses ABI encoding to properly concatenate AHR- && ALR- in front of the tokens name and symbol
      before creating each token.
**/
    constructor(
        address _assetContractAdd,
        address _oracleFactory,
        address _owner,
        address _ARTF,
        string memory _assetName,
        string memory _assetSymbol
    ) public {
        divisor = 10000;
        assetName = _assetName;
        assetSymbol = _assetSymbol;
        UOF = UniswapOracleFactoryI(_oracleFactory);
        MMF = MoneyMarketFactoryI(_owner);
        asset = IERC20(_assetContractAdd);
        ARTF = ARTFactoryI(_ARTF);
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
        uint256 _fee,
        uint256 _initialExchangeRate
    ) public onlyMMFactory {
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
@param _fee is a number representing the fee for exchanging an ALR token, as a mantissa (scaled by 1e18)
@dev this function will create a token whos name and symbol is concatenated with a "ALR-" in front of it
      example: ALR-LINK
@dev asset.approve() is called to allow the ALR contract to freeely transfer the assset from this contract when the mint
      lendToALRpool function is called.
**/
    function _setUpALR(
        address _InterestRateModel,
        uint256 _fee,
        uint256 _initialExchangeRate
    ) public onlyMMFactory {
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
@notice getAssetAdd allows for easy retrieval of a Money Markets underlying asset's address
**/
    function getAssetAdd() public view returns (address) {
        return address(asset);
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
    function setFeeAHR(uint256 _fee) public onlyOwner {
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
    function setFeeALR(uint256 _fee) public onlyOwner {
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
    function calculateFee(uint256 _payedAmount, uint256 _feePercent)
        public
        view
        returns (uint256)
    {
        uint256 fee = _payedAmount.mul(_feePercent).div(divisor);
        return fee;
    }

    /**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's High Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
    function lendToAHRpool(uint256 _amount) public {
        //transfer appropriate amount off the asset from msg.sender to the AHR contract
        asset.transferFrom(msg.sender, address(AHR), _amount);
        //call mint function on AHR contract
        AHR.mint(msg.sender, _amount);
        emit LentToAHR(msg.sender, _amount);
    }

    /**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's Low Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/
    function lendToALRpool(uint256 _amount) public {
        //transfer appropriate amount off the asset from msg.sender to the AHR contract
        asset.transferFrom(msg.sender, address(ALR), _amount);
        //call mint function on ALR contract
        ALR.mint(msg.sender, _amount);
        emit LentToALR(msg.sender, _amount);
    }

    //struct used to avoid stack too deep errors
    struct borrowVars {
        uint256 collateralValue;
        uint256 borrowBalAHR;
        uint256 borrowBalALR;
        uint256 totalFutureAmountOwed;
        uint256 priceOfAsset;
        uint256 assetAmountValOwed;
        uint256 amountValue; // Note: reverts on error
        uint256 amountOfALR;
        uint256 halfVal;
        uint256 collateralNeeded;
        uint256 half;
    }

    /**
@notice borrow is used to take out a loan from in MoneyMarketInstance's underlying asset
@param _amount is the amount of asset being barrowed
@param _collateral is the address of the ALR token being used as collateral
**/
    function borrow(uint256 _amount, address _collateral) public {
        //require that the collateral a user is looking to use is the same as the type they already have a loan in
        //OR that their cantCollateralize mapping is false
        require(
            _collateral == collateralLockedALR[msg.sender] ||
                cantCollateralize[msg.sender] == false
        );
        borrowVars memory vars;
        //check that the user has enough collateral in input money market
        //this returns the USDC price of their asset

        vars.collateralValue = MMF.checkAvailibleCollateralValue(
            msg.sender,
            _collateral
        );

        //get current borrow balances for each ART
        vars.borrowBalAHR = AHR.borrowBalanceCurrent(msg.sender);
        vars.borrowBalALR = ALR.borrowBalanceCurrent(msg.sender);
        //calculate the new amount that would be owed if borrow suceeds
        vars.totalFutureAmountOwed = vars.borrowBalAHR.add(
            vars.borrowBalALR.add(_amount)
        );
        //check current asset USDC value of whats owed
        vars.assetAmountValOwed = UOF.getUnderlyingPriceofAsset(
            address(asset),
            vars.totalFutureAmountOwed
        );
        //get USDC value of _amount
        vars.amountValue = UOF.getUnderlyingPriceofAsset(
            address(asset),
            _amount
        );
        //instantiate collateral ALR contract
        AskoRiskTokenI collateALR = AskoRiskTokenI(_collateral);
        //get collateral ALR amount for loan value
        vars.amountOfALR = collateALR.getUSDCWorthOfART(vars.amountValue);
        //divide amount value by 3
        vars.halfVal = vars.assetAmountValOwed.div(2);
        //add 1/2 value to asset value to get 150% asset value
        vars.collateralNeeded = vars.assetAmountValOwed.add(vars.halfVal);
        //require collateral value to be greater than 150% of the amount value of loan
        require(vars.collateralValue >= vars.collateralNeeded);
        //cut amount of tokens in half
        vars.half = _amount.div(2);
        //lock the collateral needed for this loan so it cant be "double spent"
        MMF.lockCollateral(msg.sender, _collateral, vars.amountOfALR);
        MMF.trackCollateralDown(msg.sender, _collateral, vars.amountOfALR);
        //track locked amount
        lockedCollateral[msg.sender] = lockedCollateral[msg.sender].add(
            vars.amountOfALR
        );
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
    function repay(uint256 _repayAmount) public {
        //get their current owed balance of ALR
        uint256 accountBorrowsALR = ALR.borrowBalanceCurrent(msg.sender);
        uint256 accountBorrowsAHR = AHR.borrowBalanceCurrent(msg.sender);
        uint256 totalBorrows = accountBorrowsALR.add(accountBorrowsAHR);
        //    require(_repayAmount <= totalBorrows, "Repaying too much");
        uint256 payAmountAHR;
        uint256 payAmountALR;
        if (accountBorrowsALR != 0) {
            //if amount owed to ALR isnt zero
            if (accountBorrowsALR >= _repayAmount) {
                //transfer asset from the user to this contract
                asset.transferFrom(msg.sender, address(ALR), _repayAmount);
                payAmountALR = ALR.repayBorrow(_repayAmount, msg.sender); // repay amount to ALR

                emit Repayed(msg.sender, 0, _repayAmount);
            } else {
                //if not
                uint256 amountToALR = _repayAmount.sub(accountBorrowsALR); //calculate amount needed to pay off ALR
                //transfer asset from the user to this contract
                asset.transferFrom(msg.sender, address(ALR), payAmountALR);
                payAmountALR = ALR.repayBorrow(amountToALR, msg.sender); //pay off ALR
                uint256 amountToAHR = _repayAmount.sub(amountToALR); //calculate AHR amount
                payAmountAHR = AHR.repayBorrow(amountToAHR, msg.sender); //pay off towards AHR
                //if payAmountAHR is greater than 0 transfer asset from the user to the AHR contract
                if (payAmountAHR > 0) {
                    asset.transferFrom(msg.sender, address(AHR), payAmountAHR);
                }
                emit Repayed(msg.sender, payAmountAHR, payAmountALR);
            }
        } else {
            //if amount owed to ALR IS zero
            payAmountAHR = AHR.repayBorrow(_repayAmount, msg.sender); //pay towards AHR
            //transfer asset from the user to this contract
            asset.transferFrom(msg.sender, address(AHR), payAmountAHR);

            if (accountBorrowsAHR == 0) {
                //if the loan is fully payed off
                //unlock the users locked collateral for this loan
                MMF.unlockCollateral(
                    msg.sender,
                    collateralLockedALR[msg.sender],
                    lockedCollateral[msg.sender]
                );
                MMF.trackCollateralUp(
                    msg.sender,
                    collateralLockedALR[msg.sender],
                    lockedCollateral[msg.sender]
                );
                //reset collateralLockedALR address to zero so the user can use a different ALR address in future borrows
                collateralLockedALR[msg.sender] = address(0);
                cantCollateralize[msg.sender] = false;
                //reset locked collateral amount
                lockedCollateral[msg.sender] = 0;
            }
            emit Repayed(msg.sender, payAmountAHR, 0);
        }
    }

    /**
@notice collateralizeALR allows a user to collateralize the ALR they hold in a specific money market
@param _amount is the amount of ALR being collateralized
**/
    function collateralizeALR(uint256 _amount) public {
        ALR.burn(msg.sender, _amount);
        MMF.trackCollateralUp(msg.sender, address(ALR), _amount);
        emit Collateralized(msg.sender, _amount);
    }

    function decollateralizeALR(uint256 _amount) public {
        uint256 availibleCollateral = MMF.checkCollateralizedALR(
            msg.sender,
            address(ALR)
        );
        require(_amount <= availibleCollateral);
        MMF.trackCollateralDown(msg.sender, address(ALR), _amount);
        ALR.mint(msg.sender, _amount);
    }

    /**
@notice allowa an ALR to check if the address calling it is anothe ALR
**/

    function checkIfALR(address _inQuestion) public view returns (bool) {
        return MMF._checkIfALR(_inQuestion);
    }
}
