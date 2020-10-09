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

 function getAssetAdd() public view virtual returns (address);

 function borrowBalanceCurrent(address account) public virtual returns (uint);

function exchangeRateCurrent() public virtual returns (uint);


function _liquidateFor(
  address _forAssetAdd,
  address _forMMI,
  uint _amountOfThisToken,
  uint _minAmount
) external
virtual;
}
