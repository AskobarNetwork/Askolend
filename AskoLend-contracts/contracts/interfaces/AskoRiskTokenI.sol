pragma solidity 0.6.6;

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
    uint256 public liquidationIncentiveMantissa;

    function getAssetAdd() public view virtual returns (address);

    function borrowBalanceCurrent(address account)
        public
        virtual
        returns (uint256);

    function exchangeRateCurrent() public virtual returns (uint256);

    function _liquidate(
        uint256 _liquidateValue,
        address _liquidator,
        address _asset
    ) public virtual;

    function mint(address _account, uint256 _amount) public virtual;

    function borrow(uint256 _borrowAmount, address _borrower) external virtual;

    function repayBorrow(uint256 repayAmount, address borrower)
        external
        virtual
        returns (uint256);

    function getwETHWorthOfART(uint256 _USDCAmount)
        public
        virtual
        returns (uint256);

    function burn(address _account, uint256 _amount) public virtual;

    function viewwETHWorthOfART(uint256 _USDCAmount)
        public
        view
        virtual
        returns (uint256);

    function convertToART(uint256 _amountOfAsset)
        public
        virtual
        returns (uint256);

    function convertFromART(uint256 _amountOfART)
        public
        virtual
        returns (uint256);

    function balanceOf(address _account) public virtual returns (uint256);

    function _updateInterestModel(address _newModel) public virtual;

    function setReserveRatio(uint256 _RR) public virtual;

    function _withdrawReserves(address _targetAdd) external virtual;

    function mintCollat(address _account, uint256 _amount) external virtual;
}
