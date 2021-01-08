pragma solidity ^0.6.2;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
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
    address public uniswap_router_add;
    address public usdc_add;
    address public factory;
    IUniswapV2Router02 public uniswapRouter;

    mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance

    /**
@notice constructor function is fired once during contract creation. This constructor initializes uniswapRouter
        as a usable contract instance within the UniswapOracleFactory
@param usdcAdd is the address of the ERC20 USDC address
@param _uniFactoryAdd is the address of the uniswap factory contract
**/
    constructor(
        address usdcAdd,
        address _uniFactoryAdd,
        address _router
    ) public {
        uniswapRouter = IUniswapV2Router02(uniswap_router_add);
        usdc_add = usdcAdd;
        factory = _uniFactoryAdd;
        uniswap_router_add = _router;
    }

    /**
  @notice createNewOracle allows the owner of this contract to deploy a new oracle contract when
          a new asset is whitelisted
  @param token is the address of the token that this oracle will provide a USDC price feed for
  **/
    function createNewOracle(address token) public onlyOwner returns (address) {
        address _oracle = address(
            new UniswapOracleInstance(factory, token, usdc_add)
        );
        instanceTracker[token] = _oracle;
        return _oracle;
    }

    /**
@notice linkMMI is used to link a MoneyMarketInstance to its oracle in the oracle factory contract
@param _MMI is the address of the MoneyMarketInstance
@param _asset is the address of the MoneyMarketInstancesunderlying asset
**/
    function linkMMI(address _MMI, address _asset) public {
        address oracle = instanceTracker[_asset];
        instanceTracker[_MMI] = oracle;
    }

    /**
@notice getUnderlyingPriceofAsset allows for the price retrieval of a MoneyMarketInstances underlying asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/
    function getUnderlyingPriceofAsset(address _MMI, uint256 _amount)
        public
        returns (uint256)
    {
        UniswapOracleInstance oracle = UniswapOracleInstance(
            instanceTracker[_MMI]
        );
        return oracle.consult(_amount);
    }

    /**
    @notice viewUnderlyingPriceofAsset allows for the price retrieval of a MoneyMarketInstances underlying asset without the gas cost of calculating with update
    @param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
    @return returns the price of the asset
    **/
    function viewUnderlyingPriceofAsset(address _MMI, uint256 _amount)
        public
        view
        returns (uint256)
    {
        UniswapOracleInstance oracle = UniswapOracleInstance(
            instanceTracker[_MMI]
        );
        return oracle.viewPrice(_amount);
    }

    /**
@notice getUnderlyingAssetPriceOfUSDC allows for the price retrieval of a MoneyMarketInstances underlying asset in asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/
    function getUnderlyingAssetPriceOfUSDC(address _MMI, uint256 _amount)
        public
        returns (uint256)
    {
        UniswapOracleInstance oracle = UniswapOracleInstance(
            instanceTracker[_MMI]
        );
        return oracle.consultUSDC(_amount);
    }

    /**
    @notice getUnderlyingAssetPriceOfUSDC allows for the price retrieval of a MoneyMarketInstances underlying asset in asset
    @param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
    @return returns the price of the asset
    **/
    function viewUnderlyingAssetPriceOfUSDC(address _MMI, uint256 _amount)
        public
        view
        returns (uint256)
    {
        UniswapOracleInstance oracle = UniswapOracleInstance(
            instanceTracker[_MMI]
        );
        return oracle.viewUSDC(_amount);
    }

}
