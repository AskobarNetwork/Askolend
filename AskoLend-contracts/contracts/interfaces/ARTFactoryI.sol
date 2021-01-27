pragma solidity 0.6.6;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title AskoRiskTokenI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////

abstract contract ARTFactoryI {
    function createART(
        address _InterestRateModel,
        address _asset,
        address _UOF,
        address _MMF,
        string memory _assetNameAHR,
        string memory _assetSymbolAHR,
        bool _isALR,
        uint256 _initialExchangeRate
    ) public virtual returns (address);
}
