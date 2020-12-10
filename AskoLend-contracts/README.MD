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
