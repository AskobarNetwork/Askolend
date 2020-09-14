pragma solidity ^0.6.2;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title UniswapOracleInstanceI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The UniswapOracleInstanceI contract an abstract contract the used to interface
    with a MoneyMarketInstance's UniswapOracleInstance. This is necissary as the OpenZeppelin and Uniswap libraries cause a
    truffle compiler error due when imported into the same contract due to the use of two seperate
    SafeMath instances
**/

abstract contract UniswapOracleInstanceI {

  /**
  @notice consult returns the price of a token in USDC
  @param _amountIn is the amount of token0 being consulted
  @return amountOut is the price of the asset amount in USDC
  **/

  function consult(uint _amountIn) external view virtual returns (uint amountOut);

}
