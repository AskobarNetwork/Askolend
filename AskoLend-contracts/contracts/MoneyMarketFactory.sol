pragma solidity ^0.6.0;

import "./MoneyMarketInstance.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
    /**
@notice the createMMI function is used to initialize the MoneyMakerInstance and deploy its associated AHR && ALR token contracts
@param _assetContractAdd is the address of the ERC20 asset being whitelisted
@param _owner is the address that will own this contract(The AskoDAO)
@param _assetName is the name of the asset(e.x: ChainLink)
@param _assetSymbol is the symbol of the asset(e.x: LINK)
@dev this function uses ABI encoding to properly concatenate AHR- && ALR- in front of the tokens name and symbol
      before creating each token.
**/
    function createMMI(
        address _assetContractAdd,
        address _owner,
        address _oracleFactory,
        string memory _assetName,
        string memory _assetSymbol
    ) public returns (address) {
        address _MMinstance = address(
            new MoneyMarketInstance(
                _assetContractAdd,
                _owner,
                _oracleFactory,
                _assetName,
                _assetSymbol
            )
        );

        return _MMinstance;
    }
}
