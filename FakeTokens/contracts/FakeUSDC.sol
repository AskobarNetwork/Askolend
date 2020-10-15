
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title FakeUSDC
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
@notice the FakeUSDC contract is used to simulate an ERC20 with uniswap on kovan
**/
contract FakeUSDC is  Ownable, ERC20 {

     constructor() public ERC20(
         "FakeUSDC",
         "FUSDC"
       ){
         _Mint(msg.sender,1000000000000000000000000000);
     }

     function _Mint(address _to, uint _amount) public onlyOwner {
       _mint(_to, _amount);
     }

     function _Burn(address _from, uint _amount) public onlyOwner {
         _burn(_from, _amount);
     }


}