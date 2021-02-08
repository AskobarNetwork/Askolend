pragma solidity 0.6.6;

////////////////////////////////////////////////////////////////////////////////////////////
/// @title MoneyMarketInstanceI
/// @author Christopher Dixon
////////////////////////////////////////////////////////////////////////////////////////////
/**
The MoneyMarketinstanceI contract an abstract contract MoneyMarketControl uses to interface
    with a MoneyMarketInstance.
    This is necissary to reduce the size of the contracts during deployment to avoid Gas Block limits
**/

abstract contract MoneyMarketInstanceI {
    address public ALR;

    function _setUpAHR(
        address _InterestRateModel,
        uint256 _fee,
        uint256 _initialExchangeRate
    ) public virtual;

    function _setUpALR(
        address _InterestRateModel,
        uint256 _fee,
        uint256 _initialExchangeRate
    ) public virtual;

    function getAssetAdd() public view virtual returns (address);

    function checkIfALR(address _inQuestion) public view virtual returns (bool);

    function decollateralizeALR(address _account, uint256 _amount)
        public
        virtual;

    function collateralizeALR(address _account, uint256 _amount) public virtual;

    function updateALR(address _newModel) public virtual;

    function updateAHR(address _newModel) public virtual;

    function setRRALR(uint256 _RR) public virtual;

    function setRRAHR(uint256 _RR) public virtual;

    function _upgradeMMIOracle(address _newOracle) external virtual;

    function _collectFees(address _targetAdd) external virtual;

    function _changeColatRatio(uint256 _newCR) external virtual;
}
