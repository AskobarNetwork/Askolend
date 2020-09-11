pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MoneyMarketInstance.sol";
////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The MoneyMarketFactory contract is designed to produce individual MoneyMarketInstance contracts
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol
**/

contract MoneyMarketFactory is Ownable {

  uint public instanceCount;
  address public uniswapProxy;


  mapping(uint => address) public instanceTracker;




  function createNewMMInstance(
    address _assetContractAdd,
		uint _depositAmount,
    uint _collateralizationRatio,
    uint _baseRate,
    uint _multiplierM,
    uint  _multiplierN,
    uint _optimal,
    uint _fee,
		string memory _assetName,
		string memory _assetSymbol
  )
  public
  onlyOwner
  {
    instanceCount++;

    address _MMinstance = address(new MoneyMarketInstance (
       _assetContractAdd,
  		 _depositAmount,
       _collateralizationRatio,
       _baseRate,
       _multiplierM,
        _multiplierN,
       _optimal,
       _fee,
  		 _assetName,
  		 _assetSymbol
    ));
    instanceTracker[instanceCount] = _MMinstance;
  }


}
