pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


////////////////////////////////////////////////////////////////////////////////////////////
/// @title AskoLowRisk
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The AskoLowRisk contract is an ERC20 contract designed to be owned by a MoneyMarketInstance contract. This contract's
token represents a Low Risk lending pool in a MoneyMarketInstance contract.
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol && ERC20.sol
**/
contract AskoLowRisk is Ownable, ERC20{

address public parentContract;

/**
@notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
is used to set up the name, symbol, and decimal variables for the AskoHighRisk contract.
@param _tokenName is the name of the asset the MoneyMarketInstance that owns this contract represents
@param _tokenSymbol is the symbol of the asset the MoneyMarketInstance that owns this contract represents
@dev these two perameters become hyphenated with "ALR" during this process( e.x: ALR-wBitcoin, ALR-wBTC)
**/
  constructor (
    string memory _tokenName,
    string memory _tokenSymbol
    )
    public
    ERC20(
      _tokenSymbol,
      _tokenName
    )
      {
        parentContract = msg.sender;
      }

/**
@notice mint is a modified function that only the owner of this contract(its MoneyMarketInstance) can call.
        This function allows an amount of AskoHighRisk token to be minted when called.
@param _account is the account the ALR is being minted to
@param _amount is the amount of ALR being minted
**/
  function mint(address account, uint256 amount) public onlyOwner {
    _mint(account, amount);
  }

/**
@notice burn is a modified function that only the owner of this contract(its MoneyMarketInstance) can call.
        This function allows an amount of AskoHighRisk token to be burned from an address when called.
@param _account is the account the ALR is being burned from
@param _amount is the amount of ALR being burned
**/
  function burn(address account, uint256 value) public onlyOwner{
    _burn(account, value);
  }



}
