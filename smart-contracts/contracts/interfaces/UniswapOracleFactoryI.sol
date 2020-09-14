pragma solidity ^0.6.2;

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

abstract contract UniswapOracleFactoryI {

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
    virtual
    returns(address);
}
