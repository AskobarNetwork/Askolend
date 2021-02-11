# AskoLend

### The AskoLend Smart-Contract set is built using the OpenZeppeling Smart-Contract library.

To run the contracts locally install Ganache-cli, clone this repo, change directories to AskoLend-Contracts and run:

`npm install`

to install the projects dependencies.

To test the contracts locally run ganache-cli using

`ganache-cli`

in a seperate terminal inside the AskoLend-Contracts directory run:

`truffle test`

### The AskoLend contracts contain several administrative functions:
`/**
@notice whitelistAsset is an onlyOwner function designed to be called by the AskoDAO.
This function creates a new MoneyMarketInstancecontract for an input asset as well
as a UniswapOracleInstance for the asset.
@param _assetContractAdd is the address of the ERC20 asset being whitelisted
@param _assetName is the name of the asset(e.x: ChainLink)
@param _assetSymbol is the symbol of the asset(e.x: LINK)
**/`
```solidity
function whitelistAsset(address _assetContractAdd, string memory _assetName,
  string memory _assetSymbol
)
```

### This function allows the MoneyMarketControl's administrator to whitelist a new ERC20 compliant token for use in the AskoLend platform.

`/**
@notice setUpAHR is used to set up a MoneyMarketInstances Asko High Risk Token as well as its InterestRateModel
@param _baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)
@param _multiplierPerYear  The rate of increase in interest rate wrt utilization (scaled by 1e18)
@param _jumpMultiplierPerYear The multiplierPerBlock after hitting a specified utilization point
@param _optimal The utilization point at which the jump multiplier is applied(Refered to as the Kink in the InterestRateModel)
@param _fee is a number representing the fee for exchanging an AHR token, as a mantissa (scaled by 1e18)
@param _assetContractAdd is the contract address of the asset whos MoneyMarketInstance is being set up
@dev this function can only be called after an asset has been whitelisted as it needs an existing MoneyMarketInstance contract
**/`

```solidity
function setUpAHR(
  uint _baseRatePerYear,
  uint _multiplierPerYear,
  uint _jumpMultiplierPerYear,
  uint _optimal,
  uint _fee,
  uint _initialExchangeRate,
  address _assetContractAdd
)

function setUpALR(
  uint _baseRatePerYear,
  uint _multiplierPerYear,
  uint _jumpMultiplierPerYear,
  uint _optimal,
  uint _fee,
  uint _initialExchangeRate,
  address _assetContractAdd
)
  ```

### These two functions are called after a new token is whitelisted. These functions create the Asko Risk Tokens for the newly whitelisted token.

`/**
@notice updateIRM allows the admin of this contract to update a AskoRiskToken's Interest Rate Model
@param _baseRatePerYear The approximate target base APR, as a mantissa (scaled by 1e18)
@param _multiplierPerYear  The rate of increase in interest rate wrt utilization (scaled by 1e18)
@param _jumpMultiplierPerYear The multiplierPerBlock after hitting a specified utilization point
@param _optimal The utilization point at which the jump multiplier is applied(Refered to as the Kink in the InterestRateModel)
@param _assetContractAdd is the contract address of the asset whos MoneyMarketInstance is being set up
@param _isALR is a bool representing whether or not the Asko risk token being updated is a ALR or not
**/`

```solidity
function updateIRM(
    uint256 _baseRatePerYear,
    uint256 _multiplierPerYear,
    uint256 _jumpMultiplierPerYear,
    uint256 _optimal,
    address _assetContractAdd,
    bool _isALR
)
```
### This function is used by the admin to update an Asko Risk Token's interest rate model

`/**
@notice updateRR allows the admin to update the reserve ratio for an Asko Risk Token
@param _newRR is the new reserve ratio value(scaled by 1e18)
@param _isALR is a bool representing whether of not the Reserve ratio being updated iis an ALR or not
@param _asset is the address of the asset(token) whos ART tokens are being updated
**/`

```solidity
function updateRR(
    uint256 _newRR,
    bool _isALR,
    address _asset
)
```

## In addition to the administrative functions there is also a liquidation function that must be called from outside the UI.

The liquidator function can be called by a python based bot using web3.py to monitor the blockchain as well as call the liquidate function. The caller must first approve the Money Market Instance contract to withdraw the asset from the liquidators account. The liquidator must have the funds to repay the borrowers loan upfront and they will receive the borrowers locked collateral for liquidating.

`/**
@notice The liquidateAccount function is called on the MMI where the borrower owes the loan.
@param _borrower is the address of the account being liquidated
@param _ARTcollateralized is the address of the ALR token that was used as collateral for the loan
    **/`

```solidity
function liquidateAccount(
    address _borrower,
    AskoRiskTokenI _ARTcollateralized
)
```


## Money Market Control functions:

The function getAssets is used to retrieve an array of all assets Whitelisted by the Money Market Control contract

`/**
@notice getAsset returns an array of all assets whitelisted on the platform.
@dev this can be used to loop through and retreive each assets MoneyMarket by the front end
**/`

```solidity
function getAssets()
```

The function trackCollateralUp is used by the Money Market Instance contracts to track collateral values upwards when collateral is locked
`/**
@notice trackCollateralUp is an external function used bya MMI to track collateral amounts globally
@param _borrower is the address of the corrower
@param _ALR is the address of the seller
@param _amount is the amount of wETH being collateralized
@dev this function can only be called by a MoneyMarketInstance.
**/`

```solidity
function trackCollateralUp(
    address _borrower,
    address _ALR,
    uint256 _amount
)
```

The function trackCollateralDown is used by the Money Market Instance contracts to track collateral values downwards when collateral is unlocked
`/**
 @notice trackCollateralDown is an external function used bya MMI to track collateral amounts globally
 @param _borrower is the address of the corrower
 @param _ALR is the address of the seller
 @param _amount is the amount of wETH being collateralized
 @dev this function can only be called by a MoneyMarketInstance.
 **/`

```solidity
function trackCollateralDown(
    address _borrower,
    address _ALR,
    uint256 _amount
)
```

checkCollateralizedALR allows a borrowers collateralized ALR amount to be retrieved
`/**
@notice checkCollateralizedALR is used by the front end to check a borrowers collateralized ALR amount
@param _borrower is the address of the borrower
@param _ALR is the address of the ALR being used as collateral
**/`

```solidity
function checkCollateralizedALR(address _borrower, address _ALR)
```

checkAvailibleCollateralValue returns the wETH value of a borrowers locked amount of ALR

`/**
@notice checkCollateralValue is a view function that accepts an account address and an ALR contract
        address and returns the USD value of the availible collateral they have. Availible collateral is
        determined by the total amount of collateral minus the amount of collateral that is still availible to borrow against
@param _borrower is the address whos collateral value we are looking up
@param _ALR is the address of the ALR token where collateral value is being looked up
 **/`

```solidity
function checkAvailibleCollateralValue(address _borrower, address _ALR)
```

_checkIfALR is used to determine if an input address is an ALR contract from an approved Money Market Instance

`/**
@notice _checkIfALR is used to check if an input address is an ALR contract
@param __inQ is the address in question
**/`

```solidity
  function _checkIfALR(address __inQ)
```

liquidateTrigger is called by a Money Market Instance during a liquidation. This function hands off the appropriate data to the appropriate ALR contract to complete the liquidation process.
`/**
@notice liquidateTrigger is a protected function that can only be called by a money market instance.
@param _liquidateValue is the value being liquidated
@param _borrower is the address of the account being liquidated
@param _liquidator is the address of the account doing the liquidating
@param _ALR is the address of the Asko Low Risk token that was used as collateral
**/`

```solidity
function liquidateTrigger(
    uint256 _liquidateValue,
    address _borrower,
    address _liquidator,
    AskoRiskTokenI _ALR
)
```

## MoneyMarketInstance contract functions:

Both of these set up functions are protected functions that can only be called by the Money Market Control contract. These functions deploy the Asko High Risk and Low Risk contracts for the Money Market Instance.

`/**
@notice setUp is called by the MoneyMarketFactory after a contract is created to set up the initial variables.
    This is split from the constructor function to keep from reaching the gas block limit
@param  _InterestRateModel is the address of this MoneyMarketInstances InterestRateModel
@param _fee is a number representing the fee for exchanging an AHR token, as a mantissa (scaled by 1e18)
@dev this function will create a token whos name and symbol is concatenated with a "AHR-" in front of it
  example: AHR-LINK
@dev asset.approve() is called to allow the AHR contract to freeely transfer the assset from this contract when the mint
  lendToAHRpool function is called.
**/`

```solidity
function _setUpAHR(
    address _InterestRateModel,
    uint256 _fee,
    uint256 _initialExchangeRate
)
```

`/**
@notice setUp is called by the MoneyMarketFactory after a contract is created to set up the initial variables.
    This is split from the constructor function to keep from reaching the gas block limit
@param  _InterestRateModel is the address of this MoneyMarketInstances InterestRateModel
@param _fee is a number representing the fee for exchanging an ALR token, as a mantissa (scaled by 1e18)
@dev this function will create a token whos name and symbol is concatenated with a "ALR-" in front of it
  example: ALR-LINK
@dev asset.approve() is called to allow the ALR contract to freeely transfer the assset from this contract when the mint
  lendToALRpool function is called.
**/`

```solidity
function _setUpALR(
    address _InterestRateModel,
    uint256 _fee,
    uint256 _initialExchangeRate
)
```

`/**
@notice viewLockedCollateralizedALR is used to view an accounts collateralized ALR
@param _account is the account whos information is being retreived
**/`

```solidity
  function viewLockedCollateralizedALR(address _account)
```

The lend functions are used by the end user to lend an ERC20 asset to the AskoLend platform. The user must first call the ERC@) approve function on the assets contract before calling these functions.

`/**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's High Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/`

```solidity
function lendToAHRpool(uint256 _amount)
```

`/**
@notice lendToAHRpool is used to lend assets to a MoneyMarketInstance's Low Risk pool
@param _amount is the amount of the asset being lent
@dev the user will need to first approve the transfer of the underlying asset
**/`

```solidity
function lendToALRpool(uint256 _amount)
```

The borrow function is called by the end user when they wish to borrow an asset from the AskoLend platform. This function requires the end user to input the address of an ALR contract where they hold some ALR token.

`/**
@notice borrow is used to take out a loan from in MoneyMarketInstance's underlying asset
@param _amount is the amount of asset being barrowed
@param _collateral is the address of the ALR token being used as collateral
**/`

```solidity
function borrow(uint256 _amount, address _collateral)
```

The repay function is called by the end user when they wish to repay some or all of their loan.

`/**
@notice repay is used to repay a loan
@param _repayAmount is the amount of the underlying asset being repayed
**/`

```solidity
repay(uint256 _repayAmount)
```
## Asko Risk Token Contract:

The Asko Risk Token contract is the contract used to create both the High Risk and Low Risk Asko tokens. This
 contract is built using the ERC20 standard contract from the Open Zeppelin library.
`/**
@notice transfer is an override function that effectively makes transferring a ART impossible. This is necessary
to avoid a user taking out a loan using his ALR as collateral and then transferring his ALR so his loan cant be
liquidated.
**/`

```solidity
function transfer(address recipient, uint256 amount)
```
The balance of underlying functions get asset balance of an account from its ART balance. The difference between these functions is that one uses the current exchange rate while the other is a view function that uses the prior calculated exchange rate. Prior is used by the front end to retrieve account information without costing the end user gas to do so.

`/**
@notice Get the underlying balance of the owners
@param owner The address of the account to query
@return The amount of underlying owned by owner
*/`

``` solidity
function balanceOfUnderlying(address owner)
```

`/**
@notice Get the underlying balance of the owners
@param owner The address of the account to query
@return The amount of underlying owned by owner
**/`

``` solidity
function balanceOfUnderlyingPrior(address owner)
```

`/**
@notice getCashPrior is a view funcion that returns and ART's balance of its underlying asset
**/`

``` solidity
function getCashPrior()
```

`/**
@notice Applies accrued interest to total borrows and reserves
@dev This calculates interest accrued from the last checkpointed block
up to the current block and writes new checkpoint to storage.
**/`

``` solidity
function accrueInterest()
```
The borrow balance functions work similar the balance of underlying functions in that one function accrues
interest before returning a calculated amount while the prior function uses the prior calculated amounts in its
calculations making it a view only function.

`/**
@notice returns last calculated account's borrow balance using the prior borrowIndex
@param account The address whose balance should be calculated after updating borrowIndex
@return The calculated balance
**/`

``` solidity
function borrowBalancePrior(address account)
```

`/**
@notice Accrue interest to updated borrowIndex and then calculate account's borrow balance using the updated borrowIndex
@param account The address whose balance should be calculated after updating borrowIndex
@return The calculated balance
**/`

``` solidity
function borrowBalanceCurrent(address account)
```

`/**
@notice Get a snapshot of the account's balances, and the cached exchange rate
@dev This is used to perform liquidity checks.
@param account Address of the account to snapshot
@return (token balance, borrow balance, exchange rate mantissa)
**/`

``` solidity
function getAccountSnapshot(address account)
```

`/**
@notice getBlockNumber allows for easy retrieval of block number
**/`

``` solidity
function getBlockNumber()
```

`/**
@notice Returns the current per-block borrow interest rate for this ART
@return The borrow interest rate per block, scaled by 1e18
**/`

``` solidity
function borrowRatePerBlock()
```
`/**
@notice Returns the current per-block supply interest rate for this ART
@return The supply interest rate per block, scaled by 1e18
**/`

``` solidity
function supplyRatePerBlock()
```
`/**
@notice getSupplyAPY roughly calculates the current APY for supplying using an average of 6500 blocks per day
**/`

``` solidity
function getSupplyAPY()
```

`/**
@notice getBorrowAPY roughly calculates the current APY for borrowing using an average of 6500 blocks per day
**/`

``` solidity
function getBorrowAPY()
```

`/**
@notice Returns the current total borrows plus accrued interest
@return The total borrows with interest
**/`

``` solidity
function totalBorrowsCurrent()
```

Like the get underlying and borrow balance functions the exchange rate functions both do basically the same thing with the only difference being that one uses the prior stored values for calculations so that it is a view function.

`/**
@notice return prior exchange rate for front end viewing
@return Calculated exchange rate scaled by 1e18
**/`

``` solidity
function exchangeRatePrior()
```

`/**
@notice Accrue interest then return the up-to-date exchange rate
@return Calculated exchange rate scaled by 1e18
**/`

``` solidity
function exchangeRateCurrent()
```

The Mint function is called by the lend function of a Money Market Instance.

`/**
@notice mint is a modified function that only the owner of this contract(its MoneyMarketInstance) can call.
        This function allows an amount of AskoRiskToken token to be minted when called.
@param _account is the account the AHR is being minted to
@param _amount is the amount of stablecoin being input
**/`

``` solidity
function mint(address _account, uint256 _amount)
```

Redeem is called by the end user to redeem their Asko Risk Token for the underlying asset they represent.

`/**
@notice redeem allows a user to redeem their AskoRiskToken for the appropriate amount of underlying asset
@param _amount is the amount of Asset being requested in ART exhange
**/`

``` solidity
function redeem(uint256 _amount)
```

The burn function is used during the liquidation process to burn tokens from the non compliant account.

`/**
@notice burn is a modified function that only the owner of this contract(its MoneyMarketInstance) can call.
        This function allows an amount of AskoRiskToken token to be burned from an address when called.
@param _account is the account the AHR is being burned from
@param _amount is the amount of AHR being burned
**/`

``` solidity
function burn(address _account, uint256 _amount)
```

Borrow is called by the Money Market instance when a user borrows an asset

`/**
@notice Sender borrows assets from the protocol to their own address
@param _borrowAmount The amount of the underlying asset to borrow
**/`

``` solidity
function borrow(uint256 _borrowAmount, address _borrower)
```

The repay borrow function is called by the Money Market Instance when a user repays their loan

`/**
@notice Sender repays their own borrow
@param repayAmount The amount to repay
**/`

``` solidity
function repayBorrow(uint256 repayAmount, address borrower)
```

The get wETH worth of art functions work similiar to all of the other current/prior functions

`/**
@pnotice getwETHWorthOfART is used to calculate the current wETH price of the input amount of Asko Risk Token
@param _amount is the amount ART being looked up
**/`

``` solidity
function getwETHWorthOfART(uint256 _amount)
```

`/**
@pnotice viewwETHWorthOfART is used to calculate the prior wETH price of the input amount of Asko Risk Token
@param _amount is the amount ART being looked up
**/`

``` solidity
function viewwETHWorthOfART(uint256 _amount)
```

The convert to ART functions work similair to all of the other current/ prior functions
`/**
@notice convertToART is used to convert an input amount of asset into the current ART value
@param _amountOfAsset is the amount of asset being input
**/`

``` solidity
function convertToART(uint256 _amountOfAsset)
```

`/**
@notice convertToART is used to convert an input amount of asset into the prior ART value
@param _amountOfAsset is the amount of asset being input
**/`

``` solidity
function viewConvertToART(uint256 _amountOfAsset)
```

`/**
@notice _liquidate is called by the Money Market Control contract during liquidation
@param _liquidateValue is the wETH value being liquidated
@param _borrower is the address of the borrower
@param _liquidator is the address of the liquidator account
**/`

``` solidity
function _liquidate(
    uint256 _liquidateValue,
    address _borrower,
    address _liquidator
)
```

`/**
@notice _updateInterestModel is used to update the interest rate model of this ART
@param _newModel is the address of the new interest rate model
**/`

``` solidity
function _updateInterestModel(address _newModel)
```

`/**
@notice setReserveRatio allows the reserve ratio to be updated
@param _RR is the new reserve ratio
**/`

``` solidity
function setReserveRatio(uint256 _RR)
```

## Uniswap Oracle Factory contract:

The Uniswap oracle factory is designed to generate uniswap oracle instances for each whitelisted asset on the AskoLend platform

`/**
@notice createNewOracle allows the owner of this contract to deploy a new oracle contract when
        a new asset is whitelisted
@param token is the address of the token that this oracle will provide a wETH price feed for
**/`

``` solidity
function createNewOracle(address token)
```

`/**
@notice linkMMI is used to link a MoneyMarketInstance to its oracle in the oracle factory contract
@param _MMI is the address of the MoneyMarketInstance
@param _asset is the address of the MoneyMarketInstancesunderlying asset
**/`

``` solidity
function linkMMI(address _MMI, address _asset)
```
The get and view functions work similar to how the current and prior functions in the Asko Risk Token contract work.

`/**
@notice getUnderlyingPriceofAsset allows for the price retrieval of a MoneyMarketInstances underlying asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/`

``` solidity
function getUnderlyingPriceofAsset(address _MMI, uint256 _amount)
```

`/**
@notice viewUnderlyingPriceofAsset allows for the price retrieval of a MoneyMarketInstances underlying asset without the gas cost of calculating with update
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/`

``` solidity
function viewUnderlyingPriceofAsset(address _MMI, uint256 _amount)
```

`/**
@notice getUnderlyingAssetPriceOfwETH allows for the price retrieval of a MoneyMarketInstances underlying asset in asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/`

``` solidity
function getUnderlyingAssetPriceOfwETH(address _MMI, uint256 _amount)
```

`/**
@notice getUnderlyingAssetPriceOfwETH allows for the price retrieval of a MoneyMarketInstances underlying asset in asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/`

``` solidity
function viewUnderlyingAssetPriceOfwETH(address _MMI, uint256 _amount)
```

## Uniswap Oracle Instance

The Uniswap Oracle Instance is designed to facilitate a wETH price feed for a specific ERC20 based asset


`/**
@notice update updates the prices for the input token pair over a set 24hour period
@dev this is an internal function called by consult if the timeElapsed is greater than 24 hours
**/`

``` solidity
function update()
```

`/**
@notice consult returns the price of a token in wETH
@return price is the price of one asset in wETH(example 1WETH in wETH)
**/`

``` solidity
function consult(uint256 _amount)
```
`/**
@notice consult returns the price of a token in wETH
@return price is the price of one asset in wETH(example 1WETH in wETH)
**/`

``` solidity
function viewPrice(uint256 _amount)
```

`/**
@notice consult returns the price of a token in wETH
@return price is the price of one asset in wETH(example 1WETH in wETH)
**/`

``` solidity
function consultwETH(uint256 _amount)
```
`/**
@notice consult returns the price of a token in wETH
@return price is the price of one asset in wETH(example 1WETH in wETH)
**/`

``` solidity
function viewwETH(uint256 _amount)
```
