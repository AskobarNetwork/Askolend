pragma solidity ^0.5.16;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketFactoryI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The MoneyMarketFactoryI contract an abstract contract the MoneyMarketInstance uses to interface
    with the MoneyMarketFactory. This is necissary as the OpenZeppelin and Uniswap libraries cause a
    truffle compiler error due when imported into the same contract due to the use of two seperate
    SafeMath instances
**/

 contract MoneyMarketFactoryI {

  /**
  @notice getStakeValue calculates the total USDC value of all of the ALR tokens a user has staked
  @param _usersAdd is the address of the user whos stake value is being looked up
  @return is the uint amount of USDC value for all of a users staked ALR
  **/
function getTotalStakeValue(address _usersAdd) public view  returns(uint);

function getMMStakeValue(address _MMadd, address _usersAdd) public view  returns(uint);

function getMMStakeAmount(address _MMadd, address _usersAdd) public view  returns(uint);

function _repay(address _MMinstance, address _userAdd) public ;
}
