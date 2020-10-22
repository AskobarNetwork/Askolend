pragma solidity ^0.6.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./compound/Exponential.sol";
import "./compound/InterestRateModel.sol";
import "./interfaces/UniswapOracleFactoryI.sol";
import "./MoneyMarketInstance.sol";
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

contract AskoRiskToken is Ownable, ERC20, Exponential {

  uint internal initialExchangeRateMantissa;
  uint public reserveFactorMantissa;
  uint public accrualBlockNumber;
  uint public borrowIndex;
  uint public totalBorrows;
  uint public totalReserves;
  uint public constant borrowRateMaxMantissa = 0.0005e16;
  uint public constant reserveFactorMaxMantissa = 1e18;

  bool public isALR;


  IERC20 public asset;
  InterestRateModel public interestRateModel;
  MoneyMarketInstance public MMI;
  UniswapOracleFactoryI public UOF;

  mapping(address => BorrowSnapshot) internal accountBorrows;

/**
@notice struct for borrow balance information
@member principal Total balance (with accrued interest), after applying the most recent balance-changing action
@member interestIndex Global borrowIndex as of the most recent balance-changing action
*/
  struct BorrowSnapshot {
      uint principal;
      uint interestIndex;
  }

/**
@notice onlyMMInstance is a modifier used to make a function only callable by theproperMoneyMarketInstance contract
**/
    modifier onlyMMInstance()  {
      require(msg.sender == address(MMI));
      _;
    }

    event InterestAccrued(uint accrualBlockNumber, uint borrowIndex, uint totalBorrows, uint totalReserves);
    event Minted(address lender, uint amountMinted);
    event Redeemed(address redeemer, uint amountART, uint assetAmountRedeemed);
    event Burn(address account, uint amount);
    event Borrowed(address borrower, uint amountBorrowed);
    event Repayed(address borrower, uint amountRepayed);

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
  constructor (
    address _interestRateModel,
    address _asset,
    address _oracleFactory,
    string memory _tokenName,
    string memory _tokenSymbol,
    bool _isALR,
    uint _initialExchangeRate
    )
    public
    ERC20(
      _tokenName,
      _tokenSymbol
    )
      {
        asset = IERC20(_asset);//instanciate the asset as a usable ERC20 contract instance
        MMI = MoneyMarketInstance(msg.sender);//instanciates this contracts MoneyMarketInstance contract
        interestRateModel = InterestRateModel(_interestRateModel);//instanciates the this contracts interest rate model as a contract
        UOF = UniswapOracleFactoryI(_oracleFactory);//instantiatesthe UniswapOracleFactory as a contract
        isALR = _isALR;// sets the isALR varaible to determine whether or not a specific contract is an ALR token
        initialExchangeRateMantissa = _initialExchangeRate;//sets the initialExchangeRateMantissa
        accrualBlockNumber = getBlockNumber();
        borrowIndex = mantissaOne;
      }

/**
@notice Get the underlying balance of the `owners`
@param owner The address of the account to query
@return The amount of underlying owned by `owner`
*/
    function balanceOfUnderlying(address owner) external  returns (uint) {
        Exp memory exchangeRate = Exp({mantissa: exchangeRateCurrent()});
        (MathError mErr, uint balance) = mulScalarTruncate(exchangeRate, balanceOf(owner));
        require(mErr == MathError.NO_ERROR);
        return balance;
    }

/**
@notice Get the underlying balance of the `owners`
@param owner The address of the account to query
@return The amount of underlying owned by `owner`
**/
    function balanceOfUnderlyingPrior(address owner) public view returns (uint) {
        Exp memory exchangeRate = Exp({mantissa: exchangeRatePrior()});
        (MathError mErr, uint balance) = mulScalarTruncate(exchangeRate, balanceOf(owner));
        require(mErr == MathError.NO_ERROR);
        return balance;
    }

/**
@notice getCashPrior is a view funcion that returns and ART's balance of its underlying asset
**/
    function getCashPrior() internal view returns (uint){
      return asset.balanceOf(address(this));
    }

/**
@notice Applies accrued interest to total borrows and reserves
@dev This calculates interest accrued from the last checkpointed block
    up to the current block and writes new checkpoint to storage.
*/
    function accrueInterest() public {
//Remember the initial block number
      uint currentBlockNumber = getBlockNumber();
      uint accrualBlockNumberPrior = accrualBlockNumber;

      //Read the previous values out of storage
      uint cashPrior = getCashPrior();
      uint borrowsPrior = totalBorrows;
      uint reservesPrior = totalReserves;
      uint borrowIndexPrior = borrowIndex;
//Short-circuit accumulating 0 interest
      if(accrualBlockNumberPrior != currentBlockNumber) {


//Calculate the current borrow interest rate
      uint borrowRateMantissa = interestRateModel.getBorrowRate(cashPrior, borrowsPrior, reservesPrior);
      require(borrowRateMantissa <= borrowRateMaxMantissa);

//Calculate the number of blocks elapsed since the last accrual
      (MathError mathErr, uint blockDelta) = subUInt(currentBlockNumber, accrualBlockNumberPrior);
      require(mathErr == MathError.NO_ERROR);
//Calculate the interest accumulated into borrows and reserves and the new index:
      Exp memory simpleInterestFactor;
      uint interestAccumulated;
      uint totalBorrowsNew;
      uint totalReservesNew;
      uint borrowIndexNew;
//simpleInterestFactor = borrowRate * blockDelta
      (mathErr, simpleInterestFactor) = mulScalar(Exp({mantissa: borrowRateMantissa}), blockDelta);
        require(mathErr == MathError.NO_ERROR);
//interestAccumulated = simpleInterestFactor * totalBorrows
      (mathErr, interestAccumulated) = mulScalarTruncate(simpleInterestFactor, borrowsPrior);
        require(mathErr == MathError.NO_ERROR);
//totalBorrowsNew = interestAccumulated + totalBorrows
      (mathErr, totalBorrowsNew) = addUInt(interestAccumulated, borrowsPrior);
        require(mathErr == MathError.NO_ERROR);
//totalReservesNew = interestAccumulated * reserveFactor + totalReserves
      (mathErr, totalReservesNew) = mulScalarTruncateAddUInt(Exp({mantissa: reserveFactorMantissa}), interestAccumulated, reservesPrior);
        require(mathErr == MathError.NO_ERROR);
//borrowIndexNew = simpleInterestFactor * borrowIndex + borrowIndex
      (mathErr, borrowIndexNew) = mulScalarTruncateAddUInt(simpleInterestFactor, borrowIndexPrior, borrowIndexPrior);
        require(mathErr == MathError.NO_ERROR);
      //Write the previously calculated values into storage
      accrualBlockNumber = currentBlockNumber;
      borrowIndex = borrowIndexNew;
      totalBorrows = totalBorrowsNew;
      totalReserves = totalReservesNew;

emit InterestAccrued(accrualBlockNumber, borrowIndex, totalBorrows, totalReserves);
    }
  }

/**
@notice returns last calculated account's borrow balance using the prior borrowIndex
@param account The address whose balance should be calculated after updating borrowIndex
@return The calculated balance
**/
    function borrowBalancePrior(address account) public view returns (uint) {
      MathError mathErr;
      uint principalTimesIndex;
      uint result;

//Get borrowBalance and borrowIndex
      BorrowSnapshot storage borrowSnapshot = accountBorrows[account];

//If borrowBalance = 0 then borrowIndex is likely also 0.
//Rather than failing the calculation with a division by 0, we immediately return 0 in this case.
      if (borrowSnapshot.principal == 0) {
        return (0);
      }

//Calculate new borrow balance using the interest index:
//recentBorrowBalance = borrower.borrowBalance * market.borrowIndex / borrower.borrowIndex
      (mathErr, principalTimesIndex) = mulUInt(borrowSnapshot.principal, borrowIndex);
      if (mathErr != MathError.NO_ERROR) {
        return (0);
      }

      (mathErr, result) = divUInt(principalTimesIndex, borrowSnapshot.interestIndex);
      if (mathErr != MathError.NO_ERROR) {
        return (0);
      }

      return (result);
    }

/**
@notice Accrue interest to updated borrowIndex and then calculate account's borrow balance using the updated borrowIndex
@param account The address whose balance should be calculated after updating borrowIndex
@return The calculated balance
**/
    function borrowBalanceCurrent(address account) public returns (uint) {
      accrueInterest();
      borrowBalancePrior(account);
    }

/**
@notice Get a snapshot of the account's balances, and the cached exchange rate
@dev This is used to perform liquidity checks.
@param account Address of the account to snapshot
@return (token balance, borrow balance, exchange rate mantissa)
**/
      function getAccountSnapshot(address account) external returns ( uint, uint, uint) {
          uint tokenBalance = balanceOf(account);
          uint borrowBalance = borrowBalanceCurrent(account);
          uint exchangeRateMantissa = exchangeRateCurrent();
        return ( tokenBalance, borrowBalance, exchangeRateMantissa);
      }

/**
@notice getBlockNumber allows for easy retrieval of block number
**/
      function getBlockNumber() internal view returns (uint) {
          return block.number;
      }

/**
@notice Returns the current per-block borrow interest rate for this ART
@return The borrow interest rate per block, scaled by 1e18
**/
      function borrowRatePerBlock() external view returns (uint) {
          return interestRateModel.getBorrowRate(getCashPrior(), totalBorrows, totalReserves);
      }

/**
@notice Returns the current per-block supply interest rate for this ART
@return The supply interest rate per block, scaled by 1e18
**/
      function supplyRatePerBlock() external view returns (uint) {
          return interestRateModel.getSupplyRate(getCashPrior(), totalBorrows, totalReserves, reserveFactorMantissa);
      }

/**
@notice Returns the current total borrows plus accrued interest
@return The total borrows with interest
**/
      function totalBorrowsCurrent() external  returns (uint) {
          accrueInterest();
          return totalBorrows;
      }

/**
@notice return prior exchange rate for front end viewing
@return Calculated exchange rate scaled by 1e18
**/
    function exchangeRatePrior() public view returns (uint) {
      if (totalSupply() == 0) {
//If there are no tokens minted: exchangeRate = initialExchangeRate
        return initialExchangeRateMantissa;
      } else {
//Otherwise: exchangeRate = (totalCash + totalBorrows - totalReserves) / totalSupply
        uint totalCash = getCashPrior();//get contract asset balance
        uint cashPlusBorrowsMinusReserves;
        Exp memory exchangeRate;
        MathError mathErr;
//calculate total value held by contract plus owed to contract
        (mathErr, cashPlusBorrowsMinusReserves) = addThenSubUInt(totalCash, totalBorrows, totalReserves);
          require(mathErr == MathError.NO_ERROR);
//calculate exchange rate
        (mathErr, exchangeRate) = getExp(cashPlusBorrowsMinusReserves, totalSupply());
          require(mathErr == MathError.NO_ERROR);
        return (exchangeRate.mantissa);
      }
    }


/**
@notice Accrue interest then return the up-to-date exchange rate
@return Calculated exchange rate scaled by 1e18
**/
      function exchangeRateCurrent() public returns (uint) {
            accrueInterest();
            exchangeRatePrior();
      }



/**
@notice Get cash balance of this cToken in the underlying asset in other contracts
@return The quantity of underlying asset owned by this contract
**/
      function getCash() external view returns (uint) {
          return getCashPrior();
      }

//struct used by mint to avoid stack too deep errors
      struct MintLocalVars {
          MathError mathErr;
          uint exchangeRateMantissa;
          uint mintTokens;
      }

/**
@notice mint is a modified function that only the owner of this contract(its MoneyMarketInstance) can call.
        This function allows an amount of AskoRiskToken token to be minted when called.
@param _account is the account the AHR is being minted to
@param _amount is the amount of AHR being minted
**/
  function mint(address _account, uint256 _amount) public onlyMMInstance {
//declare struct
    MintLocalVars memory vars;
//retrieve exchange rate
    vars.exchangeRateMantissa = exchangeRateCurrent();
//We get the current exchange rate and calculate the number of AHR to be minted:
//mintTokens = _amount / exchangeRate
    (vars.mathErr, vars.mintTokens) = divScalarByExpTruncate(_amount, Exp({mantissa: vars.exchangeRateMantissa}));
    require(vars.mathErr == MathError.NO_ERROR);
    _mint(_account, vars.mintTokens);
    emit Minted(_account, vars.mintTokens);
  }

  struct RedeemLocalVars {
      MathError mathErr;
      uint exchangeRateMantissa;
      uint redeemAmount;
  }

/**
@notice redeem allows a user to redeem their AskoRiskToken for the appropriate amount of underlying asset
@param _amount is the amount of ART being exchanged
**/
  function redeem(uint256 _amount) public {
    accrueInterest();
    require( _amount != 0 );

    RedeemLocalVars memory vars;

//get exchange rate
vars.exchangeRateMantissa = exchangeRateCurrent();

  _burn(msg.sender, _amount);
/**
We calculate the exchange rate and the amount of underlying to be redeemed:
redeemAmount = _amount x exchangeRateCurrent
*/
    (vars.mathErr, vars.redeemAmount) = mulScalarTruncate(Exp({mantissa: vars.exchangeRateMantissa}), _amount);
  require(vars.mathErr == MathError.NO_ERROR);
//Fail if protocol has insufficient cash
    require (getCashPrior() >= vars.redeemAmount);
//transfer the calculated amount of underlying asset to the msg.sender
    asset.transfer(msg.sender, vars.redeemAmount);
    emit Redeemed(msg.sender, _amount, vars.redeemAmount);
  }

/**
@notice burn is a modified function that only the owner of this contract(its MoneyMarketInstance) can call.
        This function allows an amount of AskoRiskToken token to be burned from an address when called.
@param _account is the account the AHR is being burned from
@param _amount is the amount of AHR being burned
**/
  function burn(address _account, uint256 _amount) public onlyMMInstance{
    _burn(_account, _amount);
    emit Burn( _account, _amount);

  }

//struct used by borrow function to avoid stack too deep errors
  struct BorrowLocalVars {
      MathError mathErr;
      uint accountBorrows;
      uint accountBorrowsNew;
      uint totalBorrowsNew;
  }

/**
@notice Sender borrows assets from the protocol to their own address
@param _borrowAmount The amount of the underlying asset to borrow
*/
  function borrow(uint _borrowAmount, address _borrower) external onlyMMInstance {
// _collateral the address of the ALR the user has staked as collateral?
      accrueInterest();
//Fail if protocol has insufficient underlying cash
      require(getCashPrior() > _borrowAmount);
//create local vars storage
      BorrowLocalVars memory vars;
//calculate the new borrower and total borrow balances, failing on overflow:
      vars.accountBorrows = borrowBalanceCurrent(_borrower);
//accountBorrowsNew = accountBorrows + borrowAmount
      (vars.mathErr, vars.accountBorrowsNew) = addUInt(vars.accountBorrows, _borrowAmount);
        require(vars.mathErr == MathError.NO_ERROR);
//totalBorrowsNew = totalBorrows + borrowAmount
      (vars.mathErr, vars.totalBorrowsNew) = addUInt(totalBorrows, _borrowAmount);
        require(vars.mathErr == MathError.NO_ERROR);
//We write the previously calculated values into storage
      accountBorrows[_borrower].principal = vars.accountBorrowsNew;
      accountBorrows[_borrower].interestIndex = borrowIndex;
      totalBorrows = vars.totalBorrowsNew;
//send them their loaned asset
       asset.transfer(_borrower, _borrowAmount);
       emit Borrowed(_borrower, _borrowAmount);
  }

  struct RepayBorrowLocalVars {
      MathError mathErr;
      uint repayAmount;
      uint borrowerIndex;
      uint accountBorrows;
      uint accountBorrowsNew;
      uint totalBorrowsNew;
  }

/**
@notice Sender repays their own borrow
@param repayAmount The amount to repay
*/
  function repayBorrow(uint repayAmount, address borrower) external onlyMMInstance returns(uint){
    accrueInterest();
//create local vars storage
    RepayBorrowLocalVars memory vars;
//We remember the original borrowerIndex for verification purposes
    vars.borrowerIndex = accountBorrows[borrower].interestIndex;
//We fetch the amount the borrower owes, with accumulated interest
    vars.accountBorrows = borrowBalanceCurrent(borrower);
//If repayAmount == 0, repayAmount = accountBorrows
    if (repayAmount == 0) {
        vars.repayAmount = vars.accountBorrows;
    } else {
        vars.repayAmount = repayAmount;
    }


//We calculate the new borrower and total borrow balances

//accountBorrowsNew = accountBorrows - actualRepayAmount
    (vars.mathErr, vars.accountBorrowsNew) = subUInt(vars.accountBorrows, vars.repayAmount);
      require(vars.mathErr == MathError.NO_ERROR);
//totalBorrowsNew = totalBorrows - actualRepayAmount
    (vars.mathErr, vars.totalBorrowsNew) = subUInt(totalBorrows, vars.repayAmount);
      require(vars.mathErr == MathError.NO_ERROR);
    /* We write the previously calculated values into storage */
    accountBorrows[borrower].principal = vars.accountBorrowsNew;
    accountBorrows[borrower].interestIndex = borrowIndex;
    totalBorrows = vars.totalBorrowsNew;
    emit Repayed(borrower, vars.repayAmount);
    return vars.repayAmount;
  }

  /**
  @notice _liquidateFor is called by the liquidateAccount function on a MMI where a user is being liquidated. This function
          is called on a MMI contract where collateral is staked.
  @param _forAssetAdd is the asset address that this contracts asset is being swapped for
  @param _forMMI is the MoneyMarketInstance where the swapped asset is being sent to
  @param _amountOfThisToken  is the amount of this contracts asset to be swapped
  @param _minAmount is the minimum amount of the calling MMI's asset to be swappedfor
  **/
  function _liquidateFor(
    address _forAssetAdd,
    address _forMMI,
    uint _amountOfThisToken,
    uint _minAmount
  ) external {
//require function caller to be the money market factory to ensure liquidation checks are perfomred
    require(MMI.owner() == msg.sender);
//swap out collateral for this contracts asset and send it
    UOF.swapERC20(address(asset), _forAssetAdd, _forMMI, _amountOfThisToken, _minAmount);
  }


/**
@notice getAssetAdd allows for easy retrieval of a Money Markets underlying asset's address
**/
    function getAssetAdd() public view returns (address) {
      return address(asset);
    }

}
