pragma solidity ^0.6.2;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title FakewBTC
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
@notice the FakewBTC contract is used to simulate an ERC20 with uniswap on kovan
**/
contract FakewBTC is Ownable, ERC20 {
    constructor() public ERC20("Warapped Bitcoin", "wBTC") {
        _Mint(msg.sender, 1000000000000000000000000000);
        _Mint(
            0x84166f7C1C8BB78C6553556bBa3433fe2eB5ED26,
            1000000000000000000000000000
        );
        _Mint(
            0x148d9CDB304642345bD1264604576Ae79B33a16C,
            1000000000000000000000000000
        );
        _Mint(
            0xCAA6b1207bBE1393e6F039c0f91018Bf860C885e,
            1000000000000000000000000000
        );
        _setupDecimals(8);
    }

    function _Mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function _Burn(address _from, uint256 _amount) public onlyOwner {
        _burn(_from, _amount);
    }
}
