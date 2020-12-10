pragma solidity ^0.6.2;

import "./FakeLink.sol";
import "./FakeAugur.sol";
import "./FakeBAT.sol";
import "./FakewBTC.sol";
import "./FakewETH.sol";

////////////////////////////////////////////////////////////////////////////////////////////
/// @title FakeFaucet
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
@notice the FakeFaucet contract is used to simulate an ERC20 with uniswap on kovan
**/
contract FakeFaucet {
    FakeLink public fakeLINK;
    FakeAugur public fakeAugur;
    FakeBAT public fakeBAT;
    FakewBTC public fakewBTC;
    FakewETH public fakewETH;

    mapping(address => uint256) public dontDoIT;

    constructor(
        FakeLink _FL,
        FakeAugur _FA,
        FakeBAT _FB,
        FakewBTC _FWB,
        FakewETH _FWE
    ) public {
        fakeLINK = _FL;
        fakeAugur = _FA;
        fakeBAT = _FB;
        fakewBTC = _FWB;
        fakewETH = _FWE;
    }

    function gimme() public {
        uint256 one = fakeLINK.balanceOf(msg.sender);
        uint256 two = fakeAugur.balanceOf(msg.sender);
        uint256 three = fakeBAT.balanceOf(msg.sender);
        uint256 four = fakewBTC.balanceOf(msg.sender);
        uint256 five = fakewETH.balanceOf(msg.sender);
        uint256 total = one + two + three + four + five;
        require(
            now >= dontDoIT[msg.sender] + 86400 || total == 0,
            "Error: User Greedy"
        );
        fakeLINK._Mint(msg.sender, 1000000000000000000000);
        fakeAugur._Mint(msg.sender, 1000000000000000000000);
        fakeBAT._Mint(msg.sender, 1000000000000000000000);
        fakewBTC._Mint(msg.sender, 1000000000000000000000);
        fakewETH._Mint(msg.sender, 1000000000000000000000);
        dontDoIT[msg.sender] = now;
    }
}
