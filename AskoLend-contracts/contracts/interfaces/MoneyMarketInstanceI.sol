pragma solidity ^0.6.0;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketInstanceI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The MoneyMarketinstanceI contract an abstract contract MoneyMarketControl uses to interface
    with a MoneyMarketInstance.
    This is necissary to reduce the size of the contracts during deployment to avoid Gas Block limits
**/

abstract contract MoneyMarketInstanceI {
    function _setUpAHR(
        address _InterestRateModel,
        uint256 _fee,
        uint256 _initialExchangeRate
    ) public virtual;

    function _setUpALR(
        address _InterestRateModel,
        uint256 _fee,
        uint256 _initialExchangeRate
    ) public virtual;

    function getAssetAdd() public view virtual returns (address);
}
