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

     uint public liquidationIncentiveMantissa;

 function getAssetAdd() public view virtual returns (address);

 function borrowBalanceCurrent(address account) public virtual returns (uint);

function exchangeRateCurrent() public virtual returns (uint);


function _liquidateFor(
  address _borrower,
  address _liquidator,
  address _forAssetAdd,
  address _forArt,
  uint _amountOfThisToken,
  uint _minAmount
) external
virtual;
}
