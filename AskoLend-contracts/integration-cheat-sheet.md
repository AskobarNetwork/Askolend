AskoLend integration cheat sheet.

////////////////Money Market Control////////////////////

Getter Functions:

/// input an assets address(I.E the link token address) and returns the address of
/// its money market instance
    function instancetracker( assetAddress ) returns( instanceAddress );


/// input a users address and a Asko Low Risk token address and return the amount of
/// time they have been non compliant. if this returns zero they have not been marked
/// as non compliant
    function nonCompliant ( userAddress, ALRtoken ) returns( time );

///input a users address and a Asko Low Risk token address and returns
/// the amount of ALR token the user has locked as collateral
    function collateralTracker ( userAddress, ALRtoken ) returns ( collateralAmountLocked );

///input user address and ALR token address and returns the wETH value of
///the users locked collateral
    function checkCollateralValue( usrAddress, ALRtoken )  returns( wETHvalOfCollateral );

//returns an array of all listed assets
    function getAssets() returns(address[]);
Setter Functions:

///function used to whitelist a new asset to the AskoLend platform
///input the ERC20 asset contracts address, the assets name, and the assets symbol
    function whitelistAsset( assetContractAdd, assetName, assetSymbol );


///used to set up a MoneyMarketInstances Asko High Risk Token as well as its InterestRateModel
///baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)
///multiplierPerYear  The rate of increase in interest rate wrt utilization (scaled by 1e18)
///jumpMultiplierPerYear The multiplierPerBlock after hitting a specified utilization point
///optimal The utilization point at which the jump multiplier is applied(Refered to as the Kink in the InterestRateModel)
///fee is a number representing the fee for exchanging an AHR token, as a mantissa (scaled by 1e18)
/// a mantissa representing the initial exchange rate between an asset and its associated AHR token
///assetContractAdd is the contract address of the asset whos MoneyMarketInstance is being set up

  function setUpAHR( baseRatePerYear, multiplierPerYear, jumpMultiplierPerYear, optimal, fee, initialExchangeRate, assetContractAdd );

/// both of these are used to set up a MoneyMarketInstances Asko Risk Tokens as well as its InterestRateModel
///baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)
///multiplierPerYear  The rate of increase in interest rate wrt utilization (scaled by 1e18)
///jumpMultiplierPerYear The multiplierPerBlock after hitting a specified utilization point
///optimal The utilization point at which the jump multiplier is applied(Refered to as the Kink in the InterestRateModel)
///fee is a number representing the fee for exchanging an AHR & ALR token, as a mantissa (scaled by 1e18)
/// a mantissa representing the initial exchange rate between an asset and its associated Asko Risk tokens
///assetContractAdd is the contract address of the asset whos MoneyMarketInstance is being set up

    function setUpAHR( baseRatePerYear, multiplierPerYear, jumpMultiplierPerYear, optimal, fee, initialExchangeRate, assetContractAdd );
    function setUpALR( baseRatePerYear, multiplierPerYear, jumpMultiplierPerYear, optimal, fee, initialExchangeRate, assetContractAdd) ;

//input the borrowers address and the ART token where they have a non compliant loan. This function is used
// to start the 30 minute non complaince window before a loan is liquidated.
    function markAccountNonCompliant( borrower, ART );

//input borrower address, the amount being repayed, the address of the Asko Risk token where the loan is
//taken out and the address of the Asko Risk token the borrower has locked as collateral

    function liquidateAccount( borrower,  repayAmount, ARTowed, ARTcollateralized );

## ///////////////////////// Money Market Instance //////////////////

### Getter Functions:
//retruns the address of the asset for a MoneyMarketInstance

function getAssetAdd()  returns (address)


### Setter Functions:

//both of these function take an input amount for how much of an asset is being lended to each pool
//these functions require that the user has approved the MoneyMarketInstance contract through the asset contract
// before they will work. this follows the ERC20 standard for approve/transferFrom

function lendToAHRpool( amount );
function lendToALRpool( amount );

// input the amount of asset looking to be borrowed and the address of the Asko Low Risk token the user has locked as collateral

function borrow( amount, collateral)

// input the amount being repayed on a loan. This function first repays the users borrowed amount from the ALR pool and then
// pays off the borrowed amount from the AHR pool

function repay( repayAmount );

//input the amount of ALR a user wishes to collateralize

function collateralizeALR( amount );

## ///////////////////////// AskoRiskToken /////////////

### Getter Functions:

// returns current borrow index

function borrowIndex() returns (amount);

//returns totalBorrowed amount

function totalBorrows() returns (amount);

//returns whether or not a Asko Risk Token is an AHR or ALR
function isALR() returns (bool);

//returns the amount of the underlying asset a user holds calculated from the balance of their ART

function balanceOfUnderlying( user ) returns (value);

//returns the asset balance of the ART contract

function getCashPrior() returns (balance);
    **This is an internal function!**

//returns the current borrow rate per block

function borrowRatePerBlock() returns (rate);

//Returns the current per-block supply interest rate

function supplyRatePerBlock() returns (rate);

// @TODO: Chris make Supply APY, Borrow APY

// Remove distribution APY

### Setter Functions:

//allows the userto redeem the input amount of ART for the appropriate amount of underlying asset
function redeem( amount );

//retruns the address of the asset for a MoneyMarketInstance

function getAssetAdd()  returns (address)


I expect as the front end integration progresses we may have to build out other getter functions. the etter functions here
are only the ones necessary for the user to interact with the front end.
