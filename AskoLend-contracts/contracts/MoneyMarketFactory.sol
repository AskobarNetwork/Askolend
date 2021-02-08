pragma solidity 0.6.6;

import "./MoneyMarketInstance.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

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
@param _oracleFactory is the address of the  oracle factory
@param _owner is the address of the MoneyMarketControl factory
@param _ARTF is the address of the ART Token Factory
@param _collatRatio is the number that will be used when calculating the collateralizastion ratio for a MMI
@param _assetName is the name of the asset(e.x: ChainLink)
@param _assetSymbol is the symbol of the asset(e.x: LINK)
@dev this function uses ABI encoding to properly concatenate AHR- && ALR- in front of the tokens name and symbol
      before creating each token.
**/
    function createMMI(
        address _assetContractAdd,
        address _oracleFactory,
        address _owner,
        address _ARTF,
        uint256 _collatRatio,
        string memory _assetName,
        string memory _assetSymbol
    ) public returns (address) {
        address _MMinstance =
            address(
                new MoneyMarketInstance(
                    _assetContractAdd,
                    _oracleFactory,
                    _owner,
                    _ARTF,
                    _collatRatio,
                    _assetName,
                    _assetSymbol
                )
            );

        return _MMinstance;
    }
}
