# AskoLend

### The AskoLend Smart-Contract set is built using the OpenZeppeling Smart-Contract library.

To run the contracts locally install Ganache-cli, clone this repo, change directories to AskoLend-Contracts and run:

`npm install`

to install the projects dependencies.

To test the contracts locally run ganache-cli using

`ganache-cli`

in a seperate terminal inside the AskoLend-Contracts directory run:

'truffle test'

### The AskoLend contracts contain several administrative functions:
```solidity
function whitelistAsset(address _assetContractAdd, string memory _assetName,
  string memory _assetSymbol
) ```

This function allows the MoneyMarketControl's administrator to whitelist a new ERC20 compliant token for use in the AskoLend platform
