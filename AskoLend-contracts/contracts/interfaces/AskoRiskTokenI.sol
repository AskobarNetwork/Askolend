pragma solidity ^0.6.0;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title AskoRiskTokenI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The AskoRiskTokenI contract an abstract contract MoneyMarketControl uses to interface
    with a AskoRiskToken.
    This is necissary to reduce the size of the contracts during deployment to avoid Gas Block limits
**/

abstract contract AskoRiskTokenI {
    uint256 public liquidationIncentiveMantissa;

    function getAssetAdd() public view virtual returns (address);

    function borrowBalanceCurrent(address account)
        public
        virtual
        returns (uint256);

    function exchangeRateCurrent() public virtual returns (uint256);

    function _liquidateFor(
        address _borrower,
        address _liquidator,
        address _forAssetAdd,
        address _forArt,
        uint256 _amountOfThisToken,
        uint256 _minAmount
    ) external virtual;
}
