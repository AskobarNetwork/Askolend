pragma solidity ^0.5.16;

import "./compound/CErc20.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title AskoHighRisk
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The AskoHighRisk contract is an ERC20 contract designed to be owned by a MoneyMarketInstance contract. This contract's
token represents a High Risk lending pool in a MoneyMarketInstance contract.
This contract uses the OpenZeppelin contract Library to inherit functions from
  Ownable.sol && ERC20.sol
**/

contract AskoRiskToken is CErc20 {


  /**
  @notice the constructor function is fired during the contract deployment process. The constructor can only be fired once and
          is used to set up the name, symbol, and decimal variables for the AskoHighRisk contract.
  @param underlying_ The address of the underlying asset
  @param comptroller_ The address of the Comptroller
  @param interestRateModel_ The address of the interest rate model
  @param initialExchangeRateMantissa_ The initial exchange rate, scaled by 1e18
  @param name_ ERC-20 name of this token
  @param symbol_ ERC-20 symbol of this token
  @param decimals_ ERC-20 decimal precision of this token
  @param admin_ Address of the administrator of this token
  @dev the name and symbol perameters become hyphenated with "ALR" during this process( e.x: ALR-wBitcoin, ALR-wBTC)
  **/
  constructor (
    address underlying_,
    ComptrollerInterface comptroller_,
    InterestRateModel interestRateModel_,
    uint initialExchangeRateMantissa_,
    string memory name_,
    string memory symbol_,
    uint8 decimals_,
    address payable admin_,
    bool isALR
  )
   public
   {
        // Creator of the contract is admin during initialization
        admin = msg.sender;

        // Initialize the market
        initialize(underlying_, comptroller_, interestRateModel_, initialExchangeRateMantissa_, name_, symbol_, decimals_, admin_, isALR);

        // Set the proper admin now that initialization is done
        admin = admin_;

    }

  }
