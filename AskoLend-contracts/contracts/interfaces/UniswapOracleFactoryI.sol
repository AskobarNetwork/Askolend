pragma solidity ^0.5.16;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title UniswapOracleFactoryI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The UniswapOracleFactoryI contract an abstract contract the MoneyMarketFactory uses to interface
    eith the UniswapOracleFactory. This is necissary as the OpenZeppelin and Uniswap libraries cause a
    truffle compiler error due when imported into the same contract due to the use of two seperate
    SafeMath instances
**/

 contract UniswapOracleFactoryI {

/**
@notice createNewOracle allows the owner of this contract to deploy a new oracle contract when
        a new asset is whitelisted
@param factory is the address of the uniswap factory
@param tokenA is the address of the first token in the token pair for this oracle
@param tokenB is the addresss of the second token in the token pair for this oracle
@dev this function is marked as virtual as it is an abstracted function
**/

    function createNewOracle(
      address factory,
      address tokenA,
      address tokenB
    )
    public

    returns(address);

/**
@notice getUnderlyingPrice allows for the price retrieval of a MoneyMarketInstances underlying asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/
    function getUnderlyingPrice(address _MMI) public view returns(uint);

/**
@notice swapERC20 is an external function that swaps one ERC20 token for another
        using WETH as a medium of exchange.
@param _tokenA is the address of the token being exchanged from
@param _tokenB is the address of the token being exchanged to
@param _to is the address of the MoneyMarketInstance calling this function
@param _amountIn is the amount of _tokenA being exchanged
@param _amountOutMin is the minimum amount of _tokenB to be received
@dev example: LINK => Augur swap _tokenA would be LINK address while _tokenB would be Augur Address
@dev _amountOutMin will need to be atleast enough to cover the cost of collateral liquidation
      (loan amount +i nterest) and its liquidation fee amount.
**/
  function swapERC20(
    address _tokenA,
    address _tokenB,
    address _to,
    uint _amountIn,
    uint _amountOutMin
  )
  external
  ;
}
