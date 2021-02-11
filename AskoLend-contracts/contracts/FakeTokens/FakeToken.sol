pragma solidity ^0.6.2;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title FakeToken
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
@notice the FakeToken contract is used to simulate an ERC20 with uniswap on kovan
**/
contract FakeToken is Ownable, ERC20 {
    constructor(string memory _name, string memory _symbol) public ERC20(_name, _symbol) {
        _Mint(msg.sender, 100000000000000000000000000000);

        //  _setupDecimals(10);
    }

    function _Mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function _Burn(address _from, uint256 _amount) public onlyOwner {
        _burn(_from, _amount);
    }
}
