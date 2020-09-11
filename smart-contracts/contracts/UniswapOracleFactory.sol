pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./UniswapOracleInstance.sol";


////////////////////////////////////////////////////////////////////////////////////////////
/// @title UniswapOracleFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The UniswapOracleFactory contract is designed to produce individual UniswapOracleInstance contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract UniswapOracleFactory is Ownable {

  uint public //tracks the number of instances;

  mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance

  /**
  @notice createNewOracle allows the owner of this contract to deploy a new oracle contract when
          a new asset is whitelisted
  @param factory is the address of the uniswap factory
  @param tokenA is the address of the first token in the token pair for this oracle
  @param tokenB is the addresss of the second token in the token pair for this oracle
  **/
  function createNewOracle(
    address factory,
    address tokenA,
    address tokenB
  )
  public
  onlyOwner
  {
    instanceCount++;

    address _oracle = address(new UniswapOracleInstance (
       factory,
       tokenA,
       tokenB
    ));
    instanceTracker[tokenA] = _oracle;
  }


}
