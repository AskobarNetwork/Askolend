pragma solidity 0.6.6;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title TokenI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////

abstract contract TokenI {
    function approve(address _approvie, uint256 _amount) public virtual;

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public virtual;
}
