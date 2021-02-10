pragma solidity 0.6.6;

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

  address public uniswap_router_add;

    /**
@notice createNewOracle allows the owner of this contract to deploy a new oracle contract when
        a new asset is whitelisted
@param token is the address of the first token in the token pair for this oracle
@dev this function is marked as virtual as it is an abstracted function
**/

    function createNewOracle(address token) public virtual returns (address);

    /**
@notice getUnderlyingPriceofAsset allows for the price retrieval of a MoneyMarketInstances underlying asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/
    function getUnderlyingPriceofAsset(address _MMI, uint256 _amount)
        public
        virtual
        returns (uint256);

    /**
        @notice getUnderlyingPriceofAsset allows for the price retrieval of a MoneyMarketInstances underlying asset
        @param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
        @return returns the price of the asset
        **/
    function viewUnderlyingPriceofAsset(address _MMI, uint256 _amount)
        public
        view
        virtual
        returns (uint256);

    /**
@notice getUnderlyingAssetPriceOfwETH allows for the price retrieval of a MoneyMarketInstances underlying asset in asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/
    function getUnderlyingAssetPriceOfwETH(address _MMI, uint256 _amount)
        public
        virtual
        returns (uint256);

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
        uint256 _amountIn,
        uint256 _amountOutMin
    ) external virtual;

    /**
  @notice linkMMI is used to link a MoneyMarketInstance to its oracle in the oracle factory contract
  @param _MMI is the address of the MoneyMarketInstance
  @param _asset is the address of the MoneyMarketInstancesunderlying asset
  **/
    function linkMMI(address _MMI, address _asset) public virtual;

    function viewUnderlyingAssetPriceOfwETH(address _MMI, uint256 _amount)
        public
        view
        virtual
        returns (uint256);

          function getPairAdd(address _asset) external view virtual returns(address);

          function getPathForERC20Swap(address _tokenA, address _tokenB)
              external
              view
              virtual
              returns (address[] memory);
}
