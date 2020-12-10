pragma solidity ^0.6.0;

import "./AskoRiskToken.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title ARTFactory
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////

contract ARTFactory {
    function createART(
        address _InterestRateModel,
        address _asset,
        address _UOF,
        address _MMF,
        string memory _assetNameAHR,
        string memory _assetSymbolAHR,
        bool _isALR,
        uint256 _initialExchangeRate
    ) public returns (address) {
        address ART = address(
            new AskoRiskToken( //creates new Asko High Risk Token Contract
                _InterestRateModel,
                _asset,
                _UOF,
                _MMF,
                msg.sender,
                _assetNameAHR,
                _assetSymbolAHR,
                _isALR,
                _initialExchangeRate
            )
        );

        return ART;
    }
}
