pragma solidity 0.6.6;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "./compound/Exponential.sol";
import "./compound/InterestRateModel.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
import "./interfaces/MoneyMarketInstanceI.sol";
import "./interfaces/MoneyMarketFactoryI.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title AskoRiskToken
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The AskoRiskToken contract is an ERC20 contract designed to be owned by a MoneyMarketInstance contract. This contract's
token represents a Risk lending pool in a MoneyMarketInstance contract.
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol && ERC20.sol
**/

contract AskoRiskToken is Ownable, ERC20, Exponential, ReentrancyGuard {
    using SafeMath for uint256;
    uint256 internal initialExchangeRateMantissa;
    uint256 public reserveFactorMantissa;
    uint256 public accrualBlockNumber;
    uint256 public borrowIndex;
    uint256 public totalBorrows;
    uint256 public totalReserves;
    uint256 public constant borrowRateMaxMantissa = 0.05e16;

    address public pair;

    bool public isALR;

    IERC20 public asset;
    InterestRateModel public interestRateModel;
    MoneyMarketInstanceI public MMI;
    MoneyMarketFactoryI public MMC;
    UniswapOracleFactoryI public UOF;
    IUniswapV2Router02 public uniswapRouter;

    mapping(address => BorrowSnapshot) internal accountBorrows;
    mapping(address => uint256) public amountBurnt;
    /**
@notice struct for borrow balance information
@member principal Total balance (with accrued interest), after applying the most recent balance-changing action
@member interestIndex Global borrowIndex as of the most recent balance-changing action
*/
    struct BorrowSnapshot {
        uint256 principal;
        uint256 interestIndex;
    }

    /**
@notice onlyMMInstance is a modifier used to make a function only callable by the proper MoneyMarketInstance contract
**/
    modifier onlyMMInstance() {
        require(
            msg.sender == address(MMI),
            "Msg.sender is not this contracts MMI"
        );
        _;
    }

    /**
@notice onlyMMC is a modifier used to make a function only callable by MoneyMarketControl contract
**/
    modifier onlyMMC() {
      require(
        msg.sender == address(MMC),
        "msg.sender is not the Money Market Control contract"
      );
      _;
    }

    event InterestAccrued(
        uint256 accrualBlockNumber,
        uint256 borrowIndex,
        uint256 totalBorrows,
        uint256 totalReserves
    );
    event Minted(address lender, uint256 amountMinted);
    event Redeemed(
        address redeemer,
        uint256 amountART,
        uint256 assetAmountRedeemed
    );
    event Burn(address account, uint256 amount);
    event Borrowed(address borrower, uint256 amountBorrowed);
    event Repayed(address borrower, uint256 amountRepayed);
    event Accountliquidated(
        address borrower,
        address liquidator,
        uint256 amountRepayed,
        address ARTowed,
        address ARTcollateral
    );
    event CollateralReturned(address _borrower, uint256 _amount);

    /**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
is used to set up the name, symbol, and decimal variables for the AskoRiskToken contract.
@param _interestRateModel is the address of the  interest rate model for a specific ART
@param _asset is the address of the underlying asset for a specific ART contract
@param _oracleFactory is teh address of the uniswap oracle factory contract
@param _tokenName is the name of the asset the MoneyMarketInstance that owns this contract represents
@param _tokenSymbol is the symbol of the asset the MoneyMarketInstance that owns this contract represents
@param _isALR signifies whether or not a specific AskoRiskToken instance is a high risk or low risk token.
@param _initialExchangeRate is the initial exchange rate mantissa for a specific ART
@dev these two perameters become hyphenated with "AHR" during this process( e.x: AHR-wBitcoin, AHR-wBTC)
**/
    constructor(
        address _interestRateModel,
        address _asset,
        address _oracleFactory,
        address _MoneyMarketControl,
        address _MoneyMarketInstance,
        string memory _tokenName,
        string memory _tokenSymbol,
        bool _isALR,
        uint256 _initialExchangeRate
    ) public ERC20(_tokenName, _tokenSymbol) {
        asset = IERC20(_asset); //instanciate the asset as a usable ERC20 contract instance
        MMI = MoneyMarketInstanceI(_MoneyMarketInstance); //instanciates this contracts MoneyMarketInstance contract
        interestRateModel = InterestRateModel(_interestRateModel); //instanciates the this contracts interest rate model as a contract
        UOF = UniswapOracleFactoryI(_oracleFactory); //instantiatesthe UniswapOracleFactory as a contract
        MMC = MoneyMarketFactoryI(_MoneyMarketControl);
        isALR = _isALR; // sets the isALR varaible to determine whether or not a specific contract is an ALR token
        initialExchangeRateMantissa = _initialExchangeRate; //sets the initialExchangeRateMantissa
        accrualBlockNumber = getBlockNumber();
        borrowIndex = mantissaOne;
        reserveFactorMantissa = 10000000000000000;
        pair = UOF.getPairAdd(address(asset));
        uniswapRouter = IUniswapV2Router02(UOF.uniswap_router_add());
        require(asset.approve(address(uniswapRouter), uint(-1)), "Asset approval failed");
        transferOwnership(_MoneyMarketInstance);
    }

    /////////////////////External Functions//////////////////

    /**
@notice Get the underlying balance of the `owners`
@param owner The address of the account to query
@return The amount of underlying owned by `owner`
*/
    function balanceOfUnderlying(address owner) external returns (uint256) {
        Exp memory exchangeRate = Exp({mantissa: exchangeRateCurrent()});
        (MathError mErr, uint256 balance) =
            mulScalarTruncate(exchangeRate, balanceOf(owner));
         require(mErr == MathError.NO_ERROR, "Math Error in underlying balance");
        return balance;
    }

    /**
@notice Applies accrued interest to total borrows and reserves
@dev This calculates interest accrued from the last checkpointed block
    up to the current block and writes new checkpoint to storage.
**/
    function accrueInterest() public {
        //Remember the initial block number
        uint256 currentBlockNumber = getBlockNumber();
        uint256 accrualBlockNumberPrior = accrualBlockNumber;

        //Read the previous values out of storage
        uint256 borrowsPrior = totalBorrows;
        uint256 reservesPrior = totalReserves;
        uint256 borrowIndexPrior = borrowIndex;
        //Short-circuit accumulating 0 interest
        if (accrualBlockNumberPrior != currentBlockNumber) {
            //Calculate the current borrow interest rate
          uint256 borrowRateMantissa = borrowRatePerBlock();
            require(
                borrowRateMantissa <= borrowRateMaxMantissa,
                "Borrow Rate too high"
            );

            //Calculate the number of blocks elapsed since the last accrual
            (MathError mathErr, uint256 blockDelta) =
                subUInt(currentBlockNumber, accrualBlockNumberPrior);
                require(mathErr == MathError.NO_ERROR, "Math Error in subUInt of block elapsed calculation");
            //Calculate the interest accumulated into borrows and reserves and the new index:
            Exp memory simpleInterestFactor;
            uint256 interestAccumulated;
            uint256 totalBorrowsNew;
            uint256 totalReservesNew;
            uint256 borrowIndexNew;
            //simpleInterestFactor = borrowRate * blockDelta
            (mathErr, simpleInterestFactor) = mulScalar(
                Exp({mantissa: borrowRateMantissa}),
                blockDelta
            );
            require(mathErr == MathError.NO_ERROR, "Math Error in simpleInterestFactor calculation");

            //interestAccumulated = simpleInterestFactor * totalBorrows
            (mathErr, interestAccumulated) = mulScalarTruncate(
                simpleInterestFactor,
                borrowsPrior
            );
            require(mathErr == MathError.NO_ERROR, "Math Error in interestAccumulated calculation");

            //totalBorrowsNew = interestAccumulated + totalBorrows
            (mathErr, totalBorrowsNew) = addUInt(
                interestAccumulated,
                borrowsPrior
            );
            require(mathErr == MathError.NO_ERROR, "Math Error in totalBorrowsNew calculation");

            //totalReservesNew = interestAccumulated * reserveFactor + totalReserves
            (mathErr, totalReservesNew) = mulScalarTruncateAddUInt(
                Exp({mantissa: reserveFactorMantissa}),
                interestAccumulated,
                reservesPrior
            );
            require(mathErr == MathError.NO_ERROR, "Math Error in totalReservesNew calculation");

            //borrowIndexNew = simpleInterestFactor * borrowIndex + borrowIndex
            (mathErr, borrowIndexNew) = mulScalarTruncateAddUInt(
                simpleInterestFactor,
                borrowIndexPrior,
                borrowIndexPrior
            );
            require(mathErr == MathError.NO_ERROR, "Math Error in borrowIndexNew calculation");

            //Write the previously calculated values into storage
            accrualBlockNumber = currentBlockNumber;
            borrowIndex = borrowIndexNew;
            totalBorrows = totalBorrowsNew;
            totalReserves = totalReservesNew;


        }
            emit InterestAccrued(
                accrualBlockNumber,
                borrowIndex,
                totalBorrows,
                totalReserves
            );

    }

    /**
@notice Accrue interest to updated borrowIndex and then calculate account's borrow balance using the updated borrowIndex
@param account The address whose balance should be calculated after updating borrowIndex
@return The calculated balance
**/
    function borrowBalanceCurrent(address account) public returns (uint256) {
        accrueInterest();
        return borrowBalancePrior(account);
    }

    /**
@notice Get a snapshot of the account's balances, and the cached exchange rate
@dev This is used to perform liquidity checks.
@param account Address of the account to snapshot
@return (token balance, borrow balance, exchange rate mantissa)
**/
    function getAccountSnapshot(address account)
        external
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        uint256 tokenBalance = balanceOf(account);
        uint256 borrowBalance = borrowBalanceCurrent(account);
        uint256 exchangeRateMantissa = exchangeRateCurrent();
        return (tokenBalance, borrowBalance, exchangeRateMantissa);
    }

    /**
@notice Returns the current total borrows plus accrued interest
@return The total borrows with interest
**/
    function totalBorrowsCurrent() external returns (uint256) {
        accrueInterest();
        return totalBorrows;
    }

    /**
@notice Accrue interest then return the up-to-date exchange rate
@return Calculated exchange rate scaled by 1e18
**/
    function exchangeRateCurrent() public returns (uint256) {
        accrueInterest();
        return exchangeRatePrior();
    }



    /**
@notice mint is a modified function that only the owner of this contract(its MoneyMarketInstance) can call.
        This function allows an amount of AskoRiskToken token to be minted when called.
@param _account is the account the AHR is being minted to
@param _amount is the amount of stablecoin being input
**/
    function mint(address _account, uint256 _amount) external onlyMMInstance nonReentrant {
        uint256 mintTokens =  convertToART(_amount);
        _mint(_account, mintTokens);
        emit Minted(_account, mintTokens);
    }



    /**
@notice redeem allows a user to redeem their AskoRiskToken for the appropriate amount of underlying asset
@param _amount is the amount of Asset being requested in ART exhange
**/
    function redeem(uint256 _amount) external nonReentrant {
        require(_amount != 0, "amount cannot be zero");
        require(_amount <= convertFromART(balanceOf(msg.sender)), "trying to redeem more than held");
        require(
          getCashPrior() >= _amount,
          "Protocol has insufficient funds for redeem"
        );

        _burn(msg.sender, convertToART(_amount));
        require(asset.transfer(msg.sender, _amount), "Failed to transfer asset when redeemed");
        emit Redeemed(msg.sender, _amount, convertToART(_amount));
    }

    /**
@notice burn is a modified function that only the MoneyMarket Control can call.
        This function allows an amount of AskoRiskToken token to be burned from an address when called.
@param _account is the account the AHR is being burned from
@param _amount is the wETH amount of AHR being burned
**/
    function burn(address _account, uint256 _amount) external nonReentrant onlyMMC{
        uint256 assetAmount =
            UOF.getUnderlyingAssetPriceOfwETH(address(asset), _amount);
        uint256 artAmount = convertToART(assetAmount);
         _burn(_account, artAmount);
         _mint(address(this), artAmount);
         amountBurnt[_account] = amountBurnt[_account].add(artAmount);
        emit Burn(_account, artAmount);
    }

    /**
@notice mintCollat allows the MoneyMarketControl to mint a users ALR back to them when their collateral is decolateralized
@param _account is the account receiving the ALR back
@param _amount is the wETH value of the ALR being returned
**/
    function mintCollat(address _account, uint256 _amount) external nonReentrant onlyMMC{
        uint256 assetAmount =
            UOF.getUnderlyingAssetPriceOfwETH(address(asset), _amount);
        uint256 artAmount = convertToART(assetAmount);

         _burn(address(this),  amountBurnt[_account]);
          amountBurnt[_account] = 0;

         _mint(_account, artAmount);
        emit CollateralReturned(_account, artAmount);
    }

    //struct used by borrow function to avoid stack too deep errors
    struct BorrowLocalVars {
        MathError mathErr;
        uint256 accountBorrows;
        uint256 accountBorrowsNew;
        uint256 totalBorrowsNew;
    }

    /**
@notice Sender borrows assets from the protocol to their own address
@param _borrowAmount The amount of the underlying asset to borrow
*/
    function borrow(uint256 _borrowAmount, address _borrower)
        external
        nonReentrant
        onlyMMInstance
    {
        //Fail if protocol has insufficient underlying cash
        require(getCashPrior() > _borrowAmount, "not enough token to borrow");
        //create local vars storage
        BorrowLocalVars memory vars;
        //calculate the new borrower and total borrow balances, failing on overflow:
        vars.accountBorrows = borrowBalanceCurrent(_borrower);
        //accountBorrowsNew = accountBorrows + borrowAmount
        (vars.mathErr, vars.accountBorrowsNew) = addUInt(
            vars.accountBorrows,
            _borrowAmount
        );
        require(vars.mathErr == MathError.NO_ERROR, "Math Error in accountBorrowsNew calculation");

        //totalBorrowsNew = totalBorrows + borrowAmount
        (vars.mathErr, vars.totalBorrowsNew) = addUInt(
            totalBorrows,
            _borrowAmount
        );
        require(vars.mathErr == MathError.NO_ERROR, "Math Error in totalBorrowsNew calculation");

        //We write the previously calculated values into storage
        accountBorrows[_borrower].principal = vars.accountBorrowsNew;
        accountBorrows[_borrower].interestIndex = borrowIndex;
        totalBorrows = vars.totalBorrowsNew;
        //send them their loaned asset
        require(asset.transfer(_borrower, _borrowAmount), "asset transfer failed during borrow");
        emit Borrowed(_borrower, _borrowAmount);
    }

    struct RepayBorrowLocalVars {
        MathError mathErr;
        uint256 repayAmount;
        uint256 borrowerIndex;
        uint256 accountBorrows;
        uint256 accountBorrowsNew;
        uint256 totalBorrowsNew;
    }

    /**
@notice Sender repays their own borrow
@param repayAmount The amount to repay
@param borrower is the address of the borrowing account
*/
    function repayBorrow(uint256 repayAmount, address borrower)
        external
        onlyMMInstance
        returns (uint256)
    {
        //create local vars storage
        RepayBorrowLocalVars memory vars;
        //We fetch the amount the borrower owes, with accumulated interest
        vars.accountBorrows = borrowBalanceCurrent(borrower);
        //We remember the original borrowerIndex for verification purposes
        vars.borrowerIndex = accountBorrows[borrower].interestIndex;
        //If repayAmount == 0, repayAmount = accountBorrows

        if (repayAmount == 0) {
            vars.repayAmount = vars.accountBorrows;
        } else {
            vars.repayAmount = repayAmount;
        }

        //We calculate the new borrower and total borrow balances

        //accountBorrowsNew = accountBorrows - actualRepayAmount
        (vars.mathErr, vars.accountBorrowsNew) = subUInt(
            vars.accountBorrows,
            vars.repayAmount
        );

        require(vars.mathErr == MathError.NO_ERROR, "Math Error in accountBorrowsNew calculation");

        //totalBorrowsNew = totalBorrows - actualRepayAmount
        (vars.mathErr, vars.totalBorrowsNew) = subUInt(
            totalBorrows,
            vars.repayAmount
        );
        //in rare cases when repayAmount == 0 a rounding issue can cause an underflow
        //to avoid this we just assert that vars.totalBorrowsNew = 0 if there is a math error
        if(vars.mathErr == MathError.NO_ERROR) {
          vars.totalBorrowsNew = 0;
        }

        /* We write the previously calculated values into storage */
        accountBorrows[borrower].principal = vars.accountBorrowsNew;
        accountBorrows[borrower].interestIndex = vars.borrowerIndex;
        totalBorrows = vars.totalBorrowsNew;
        emit Repayed(borrower, vars.repayAmount);
        return vars.repayAmount;
    }

    /**
@notice getwETHWorthOfART is used to calculate the current wETH price of the input amount of Asko Risk Token
@param _amount is the amount ART being looked up
**/
    function getwETHWorthOfART(uint256 _amount) external returns (uint256) {
        uint256 assetValOfArt = convertFromART(_amount);
        //get asset price of wETH
        uint256 wETHAmountOfAsset =
            UOF.getUnderlyingPriceofAsset(address(asset), assetValOfArt);

        return wETHAmountOfAsset;
    }

    /**
@notice convertToART is used to convert an input amount of asset into the current ART value
@param _amountOfAsset is the amount of asset being input
**/
    function convertToART(uint256 _amountOfAsset) public returns (uint256) {
        //We get the current exchange rate and calculate the number of AHR to be minted:
        //mintTokens = _amount / exchangeRate
        MathError mathErr;
        uint256 artTokens;

        (mathErr, artTokens) = divScalarByExpTruncate(
            _amountOfAsset,
            Exp({mantissa: exchangeRateCurrent()})
        );
        require(mathErr == MathError.NO_ERROR, "Math Error in artTokens calculation");

        return artTokens;
    }

    /**
@notice convertFromART converts an input amount of ART to the current value in the underlying asset
@param _amountOfART is the amount of ART being converted
**/
    function convertFromART(uint256 _amountOfART) public returns (uint256) {
        //We get the current exchange rate and calculate the number of AHR to be minted:
        //mintTokens = _amount / exchangeRate
        MathError mathErr;
        uint256 assetVal;
        (mathErr, assetVal) = mulScalarTruncate(
            Exp({mantissa: exchangeRateCurrent()}),
            _amountOfART
        );
        require(mathErr == MathError.NO_ERROR, "Math Error in assetVal calculation");

        return assetVal;
    }

    /**
    @notice _updateInterestModel is used to update the interest rate model of this ART
    @param _newModel is the address of the new interest rate model
    **/
    function _updateInterestModel(address _newModel) external onlyOwner {
        interestRateModel = InterestRateModel(_newModel);
    }

    /**
    @notice _updateOracle is used to update the oracle of this ART
    @param _newOracle is the address of the new oracle
    **/
    function _updateOracle(address _newOracle) external onlyOwner {
          UOF = UniswapOracleFactoryI(_newOracle);
    }

    /**
    @notice setReserveRatio allows the reserve ratio to be updated
    @param _RR is the new reserve ratio
    **/
    function setReserveRatio(uint256 _RR) external onlyOwner {
        reserveFactorMantissa = _RR;
    }

    /**
@notice _liquidate is called by the Money Market Control contract during liquidation
@param _liquidateValue is the wETH value being liquidated
@param _liquidator is the address of the liquidator account
**/
    function _liquidate(
        uint256 _liquidateValue,
        address _liquidator,
        address _asset,
        address _account
    ) external nonReentrant onlyMMC{
        //get asset amount of the input wETH price
        uint256 assetVal =
            UOF.getUnderlyingAssetPriceOfwETH(address(asset), _liquidateValue);

            _burn(address(this),  amountBurnt[_account]);
            amountBurnt[_account] = 0;
        uint256 deadline = block.timestamp + 240;

        uniswapRouter.swapExactTokensForTokens(
            assetVal,
            0,
            UOF.getPathForERC20Swap(address(asset), _asset),
            _liquidator,
            deadline
        );
    }

    /**
@notice _withdrawFee allows the MoneyMarketInstance to withdraw the fee revenue from the
        ARTs reserves
@param _targetAdd is the address the fees will be sent to
**/
    function _withdrawFee(address _targetAdd) external onlyOwner nonReentrant {
        asset.transfer(_targetAdd, totalReserves);
        totalReserves = 0;
    }

    //////////////View Functions/////////////////////////
    /**
    @notice Get the underlying balance of the `owners`
    @param owner The address of the account to query
    @return The amount of underlying owned by `owner`
    **/
    function balanceOfUnderlyingPrior(address owner)
        external
        view
        returns (uint256)
    {
        Exp memory exchangeRate = Exp({mantissa: exchangeRatePrior()});
        (MathError mErr, uint256 balance) =
            mulScalarTruncate(exchangeRate, balanceOf(owner));
        require(
            mErr == MathError.NO_ERROR,
            "Math Error in balance of underlying"
        );
        return balance;
    }

    /**
    @notice getCashPrior is a view funcion that returns and ART's balance of its underlying asset
    **/
    function getCashPrior() internal view returns (uint256) {
        return asset.balanceOf(address(this));
    }

    /**
    @notice convertToART is used to convert an input amount of asset into the prior ART value
    @param _amountOfAsset is the amount of asset being input
    **/
    function viewConvertToART(uint256 _amountOfAsset)
    external
    view
    returns (uint256)
    {
      //We get the current exchange rate and calculate the number of ART to be minted:
      //mintTokens = _amount / exchangeRate
      MathError mathErr;
      uint256 artTokens;

      (mathErr, artTokens) = divScalarByExpTruncate(
          _amountOfAsset,
          Exp({mantissa: exchangeRatePrior()})
      );
      require(mathErr == MathError.NO_ERROR, "Math Error in artTokens calculation");

      return artTokens;
    }
    /**
    @notice convertFromART converts an input amount of ART to the prior value in the underlying asset
    @param _amountOfART is the amount of ART being converted
    **/
    function viewConvertFromART(uint256 _amountOfART)
        public
        view
        returns (uint256)
    {
        //We get the current exchange rate and calculate the number of AHR to be minted:
        //artTokens = _amount * exchangeRate
        MathError mathErr;
        uint256 artTokens;
        (mathErr, artTokens) = mulScalarTruncate(
          Exp({mantissa: exchangeRatePrior()}),
          _amountOfART
        );
        require(mathErr == MathError.NO_ERROR, "Math Error in artTokens calculation");

        return artTokens;
    }


    /**
    @notice viewwETHWorthOfART is used to calculate the prior wETH price of the input amount of Asko Risk Token
    @param _amount is the amount ART being looked up
    **/
    function viewwETHWorthOfART(uint256 _amount)
        external
        view
        returns (uint256)
    {
        uint256 assetValOfArt = viewConvertFromART(_amount);
        //get asset price of wETH
        uint256 wETHAmountOfAsset =
            UOF.viewUnderlyingPriceofAsset(address(asset), assetValOfArt);
        //return one ART USD value
        return wETHAmountOfAsset;
    }

    /**
    @notice getAssetAdd allows for easy retrieval of a Money Markets underlying asset's address
    **/
    function getAssetAdd() external view returns (address) {
        return address(asset);
    }

    /**
    @notice Get cash balance of this cToken in the underlying asset in other contracts
    @return The quantity of underlying asset owned by this contract
    **/
    function getCash() external view returns (uint256) {
        return getCashPrior();
    }

    /**
    @notice return prior exchange rate for front end viewing
    @return Calculated exchange rate scaled by 1e18
    **/
    function exchangeRatePrior() public view returns (uint256) {
        if (totalSupply() == 0) {
            //If there are no tokens minted: exchangeRate = initialExchangeRate
            return initialExchangeRateMantissa;
        } else {
            //Otherwise: exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
            uint256 totalCash = getCashPrior(); //get contract asset balance
            uint256 cashPlusBorrowsMinusReserves;
            Exp memory exchangeRate;
            MathError mathErr;
            //calculate total value held by contract plus owed to contract
            (mathErr, cashPlusBorrowsMinusReserves) = addThenSubUInt(
                totalCash,
                totalBorrows,
                totalReserves
            );
            require(mathErr == MathError.NO_ERROR, "Math Error in cashPlusBorrowsMinusReserves calculation");

            //calculate exchange rate
            (mathErr, exchangeRate) = getExp(
                cashPlusBorrowsMinusReserves,
                totalSupply()
            );
            require(mathErr == MathError.NO_ERROR, "Math Error in exchangeRate calculation");

            return (exchangeRate.mantissa);
        }
    }

    /**
    @notice getSupplyAPY roughly calculates the current APY for supplying using an average of 6500 blocks per day
    **/
    function getSupplyAPY() external view returns (uint256) {
        //multiply rate per block by blocks per year with an average of 6500 blocks a day per https://ycharts.com/indicators/ethereum_blocks_per_day
        return supplyRatePerBlock().mul(2102400);
    }

    /**
    @notice getBorrowAPY roughly calculates the current APY for borrowing using an average of 6500 blocks per day
    **/
    function getBorrowAPY() external view returns (uint256) {
        //multiply rate per block by blocks per year with an average of 6500 blocks a day per https://ycharts.com/indicators/ethereum_blocks_per_day
        return borrowRatePerBlock().mul(2102400);
    }

    /**
    @notice Returns the current per-block borrow interest rate for this ART
    @return The borrow interest rate per block, scaled by 1e18
    **/
    function borrowRatePerBlock() public view returns (uint256) {
        return
            interestRateModel.getBorrowRate(
                getCashPrior(),
                totalBorrows,
                totalReserves
            );
    }

    /**
    @notice Returns the current per-block supply interest rate for this ART
    @return The supply interest rate per block, scaled by 1e18
    **/
    function supplyRatePerBlock() public view returns (uint256) {
        return
            interestRateModel.getSupplyRate(
                getCashPrior(),
                totalBorrows,
                totalReserves,
                reserveFactorMantissa
            );
    }

    /**
    @notice getBlockNumber allows for easy retrieval of block number
    **/
    function getBlockNumber() internal view returns (uint256) {
        return block.number;
    }

    /**
    @notice returns last calculated account's borrow balance using the prior borrowIndex
    @param account The address whose balance should be calculated after updating borrowIndex
    @return The calculated balance
    **/
    function borrowBalancePrior(address account) public view returns (uint256) {
        MathError mathErr;
        uint256 principalTimesIndex;
        uint256 result;

        //Get borrowBalance and borrowIndex
        BorrowSnapshot memory borrowSnapshot = accountBorrows[account];

        //If borrowBalance = 0 then borrowIndex is likely also 0.
        //Rather than failing the calculation with a division by 0, we immediately return 0 in this case.
        if (borrowSnapshot.principal == 0) {
            return (0);
        }

        //Calculate new borrow balance using the interest index:
        //recentBorrowBalance = borrower.borrowBalance * market.borrowIndex / borrower.borrowIndex
        (mathErr, principalTimesIndex) = mulUInt(
            borrowSnapshot.principal,
            borrowIndex
        );
        require(mathErr == MathError.NO_ERROR, "borrowBalancePrior: principalTimesIndex calculation error");


        (mathErr, result) = divUInt(
            principalTimesIndex,
            borrowSnapshot.interestIndex
        );
        require(mathErr == MathError.NO_ERROR, "borrowBalancePrior: result calculation error");


        return (result);
    }
}
