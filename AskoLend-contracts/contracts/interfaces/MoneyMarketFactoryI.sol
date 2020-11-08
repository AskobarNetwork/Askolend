pragma solidity ^0.6.0;

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

abstract contract MoneyMarketFactoryI {
    /**
   @notice the createMMI function is used to initialize the MoneyMakerInstance and deploy its associated AHR && ALR token contracts
   @param _assetContractAdd is the address of the ERC20 asset being whitelisted
   @param _owner is the address that will own this contract(The AskoDAO)
   @param _assetName is the name of the asset(e.x: ChainLink)
   @param _assetSymbol is the symbol of the asset(e.x: LINK)
   @dev this function uses ABI encoding to properly concatenate AHR- && ALR- in front of the tokens name and symbol
         before creating each token.
   **/
    function createMMI(
        address _assetContractAdd,
        address _owner,
        address _oracleFactory,
        string memory _assetName,
        string memory _assetSymbol
    ) public virtual returns (address);

    function liquidateBorrowAllowed(
        address _lendedART,
        address _collateralART,
        address _liquidater,
        address _borrower,
        uint256 _repayAmount
    ) public virtual returns (bool);

    function checkAvailibleCollateralValue(address _borrower, address _ALR)
        external
        virtual
        returns (uint256);

    function trackCollateralUp(
        address _borrower,
        address _ALR,
        uint256 _amount
    ) external virtual;

    function trackCollateralDown(
        address _borrower,
        address _ALR,
        uint256 _amount
    ) external virtual;

    function lockCollateral(
        address _borrower,
        address _ALR,
        uint256 _amount
    ) external virtual;

    function unlockCollateral(
        address _borrower,
        address _ALR,
        uint256 _amount
    ) external virtual;

    function _checkIfALR(address __inQ) external view virtual returns (bool);
}
