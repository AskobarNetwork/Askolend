pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import '@uniswap/v2-periphery/contracts/UniswapV2Router02.sol';
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
  address public uniswap_router_add = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
  address public usdc_add;
  IUniswapV2Router02 public uniswapRouter;

  mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance

/**
@notice constructor function is fired once during contract creation. This constructor initializes uniswapRouter
        as a usable contract instance within the UniswapOracleFactory
**/
constructor(address usdcAdd) public {
  uniswapRouter = IUniswapV2Router02(uniswap_router_add);
  usdc_add = usdcAdd;
}

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
  returns(address)
  {

    address _oracle = address(new UniswapOracleInstance (
       factory,
       tokenA,
       tokenB
    ));
    instanceTracker[tokenA] = _oracle;
    return _oracle;
  }

/**
@notice getPathForERC20Swap is an internal function used to create a uniswap trade path for two input
        ERC20 tokens using WETH as a medium of exchange.
@param _tokenA is the address of the token being exchanged from
@param _tokenB is the address of the token being exchanged to
@dev example: LINK => Augur swap _tokenA would be LINK address while _tokenB would be Augur Address
**/
  function getPathForERC20Swap(address _tokenA, address _tokenB) private view returns (address[] memory) {
    address[] memory path = new address[](3);
    path[0] = _tokenA;
    path[1] = uniswapRouter.WETH();
    path[2] = _tokenB;

    return path;
  }

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
  ) external {
    uint deadline = block.timestamp + 60;
    uniswapRouter.swapExactTokensForTokens(
      _amountIn,
      _amountOutMin,
      getPathForERC20Swap(_tokenA, _tokenB),
      _to,
      deadline
    );
  }


}
