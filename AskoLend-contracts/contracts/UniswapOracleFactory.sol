pragma solidity 0.6.6;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
import "./interfaces/UniI.sol";
import "./interfaces/TokenI.sol";
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
    address public wETH_add;
    UniI public factory;
    IUniswapV2Router02 public uniswapRouter;

    mapping(address => address) public instanceTracker; //maps erc20 address to the assets MoneyMarketInstance

event MMIlinked(address MMI, address asset);
    /**
@notice constructor function is fired once during contract creation. This constructor initializes uniswapRouter
        as a usable contract instance within the UniswapOracleFactory
@param _uniFactoryAdd is the address of the uniswap factory contract
@param _router is the address of the uniswap router contract
**/
    constructor(
        address _uniFactoryAdd,
        address _router,
        address _wETH
    ) public {
        uniswapRouter = IUniswapV2Router02(_router);
        factory = UniI(_uniFactoryAdd);
        wETH_add = _wETH;
        uniswap_router_add = _router;
    }

    /**
  @notice createNewOracle allows the owner of this contract to deploy a new oracle contract when
          a new asset is whitelisted
  @param token is the address of the token that this oracle will provide a wETH price feed for
  **/
    function createNewOracle(address token) external onlyOwner returns (address) {
        address _oracle =
            address(
                new UniswapOracleInstance(address(factory), token, wETH_add)
            );
        instanceTracker[token] = _oracle;
        return _oracle;
    }

    /**
@notice linkMMI is used to link a MoneyMarketInstance to its oracle in the oracle factory contract
@param _MMI is the address of the MoneyMarketInstance
@param _asset is the address of the MoneyMarketInstancesunderlying asset
**/
    function linkMMI(address _MMI, address _asset) external onlyOwner {
        address oracle = instanceTracker[_asset];
        instanceTracker[_MMI] = oracle;
        emit MMIlinked(_MMI, _asset);
    }

    /**
@notice getUnderlyingPriceofAsset allows for the price retrieval of a MoneyMarketInstances underlying asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/
    function getUnderlyingPriceofAsset(address _MMI, uint256 _amount)
        external
        returns (uint256)
    {
        UniswapOracleInstance oracle =
            UniswapOracleInstance(instanceTracker[_MMI]);
        return oracle.consult(_amount);
    }

    /**
    @notice viewUnderlyingPriceofAsset allows for the price retrieval of a MoneyMarketInstances underlying asset without the gas cost of calculating with update
    @param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
    @return returns the price of the asset
    **/
    function viewUnderlyingPriceofAsset(address _MMI, uint256 _amount)
        external
        view
        returns (uint256)
    {
        UniswapOracleInstance oracle =
            UniswapOracleInstance(instanceTracker[_MMI]);
        return oracle.viewPrice(_amount);
    }

    /**
@notice getUnderlyingAssetPriceOfwETH allows for the price retrieval of a MoneyMarketInstances underlying asset in asset
@param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
@return returns the price of the asset
**/
    function getUnderlyingAssetPriceOfwETH(address _MMI, uint256 _amount)
        external
        returns (uint256)
    {
        UniswapOracleInstance oracle =
            UniswapOracleInstance(instanceTracker[_MMI]);
        return oracle.consultwETH(_amount);
    }

    /**
    @notice viewUnderlyingAssetPriceOfwETH allows for the price retrieval of a MoneyMarketInstances underlying asset in asset
    @param _MMI is the address of the MoneyMarketInstance whos asset price is being retrieved
    @return returns the price of the asset
    **/
    function viewUnderlyingAssetPriceOfwETH(address _MMI, uint256 _amount)
        external
        view
        returns (uint256)
    {
        UniswapOracleInstance oracle =
            UniswapOracleInstance(instanceTracker[_MMI]);
        return oracle.viewwETH(_amount);
    }

    /**
@notice getPathForERC20Swap is an external function used to create a uniswap trade path for two input
      ERC20 tokens using WETH as a medium of exchange.
@param _tokenA is the address of the token being exchanged from
@param _tokenB is the address of the token being exchanged to
@dev example: LINK => Augur swap _tokenA would be LINK address while _tokenB would be Augur Address
**/
    function getPathForERC20Swap(address _tokenA, address _tokenB)
        external
        view
        returns (address[] memory)
    {
        address[] memory path = new address[](3);
        path[0] = _tokenA;
        path[1] = wETH_add;
        path[2] = _tokenB;

        return path;
    }

    /**
  @notice getPairAdd is used to return the address of the input assets wETH uniswap pair contract
  @param _asset is the address of the ERC20 token contract whos pair contract is being retrieved
  **/
    function getPairAdd(address _asset) external view returns (address) {
        return factory.getPair(_asset, wETH_add);
    }
}
