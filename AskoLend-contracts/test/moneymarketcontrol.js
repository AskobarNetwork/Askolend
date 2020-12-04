console.log("in tests");
const Web3 = require("web3");
const utils = require("./utils.js");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const FakeAugur = artifacts.require("FakeAugur");
const FakeLink = artifacts.require("FakeLink");
const FakeUSDC = artifacts.require("FakeUSDC");
const MoneyMarketInstance = artifacts.require("MoneyMarketInstance");
const AskoRiskToken = artifacts.require("AskoRiskToken");
const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");

contract("MoneyMarketControl", (accounts) => {
  console.log("starting tests");
  const ONE_DAY = 1000 * 86400;
  const ONE_YEAR = 365 * ONE_DAY;
  let account_one = accounts[0];
  let account_two = accounts[1];
  let augur;
  let link;
  let usdc;
  let MMC;
  let linkMMIAdd;
  let linkMMI;
  let augurMMIAdd;
  let augurMMI;
  let linkAHR;
  let linkALR;
  let augurAHR;
  let augurALR;

  before(async function () {
    augur = await FakeAugur.deployed();
    link = await FakeLink.deployed();
    usdc = await FakeUSDC.deployed();
    oracle = await UniswapOracleFactory.deployed();
    MMC = await MoneyMarketControl.deployed();
    linkMMIAdd = await MMC.instanceTracker.call(FakeLink.address);
    linkMMI = await MoneyMarketInstance.at(linkMMIAdd);
    linkAHR = await AskoRiskToken.at(await linkMMI.ahr());
    linkALR = await AskoRiskToken.at(await linkMMI.alr());
    augurMMIAdd = await MMC.instanceTracker.call(FakeAugur.address);
    augurMMI = await MoneyMarketInstance.at(augurMMIAdd);
    augurAHR = await AskoRiskToken.at(await augurMMI.ahr());
    augurALR = await AskoRiskToken.at(await augurMMI.alr());
  });
  ///////////////////////////////////////////////////////////////////////////////////
  it("should check that the oracle is returning the right prices", async () => {
    let priceOfOneLink = await oracle.viewUnderlyingPriceofAsset(
      link.address,
      web3.utils.toWei("1")
    );
    console.log(
      "the price of one link is: " + web3.utils.fromWei(priceOfOneLink)
    );
    assert.equal(
      web3.utils.fromWei(priceOfOneLink),
      "10",
      "Returning the wrong price"
    );
    let priceOfOneAugur = await oracle.viewUnderlyingPriceofAsset(
      augur.address,
      web3.utils.toWei("1")
    );
    console.log(
      "the price of one augur is: " + web3.utils.fromWei(priceOfOneAugur)
    );
    assert.equal(
      web3.utils.fromWei(priceOfOneAugur),
      "20",
      "Returning the wrong price"
    );

    let priceOfOneAugurInUSDC = await oracle.viewUnderlyingAssetPriceOfUSDC(
      augur.address,
      web3.utils.toWei("1")
    );
    console.log(
      "the price of one USDC in augur is: " +
        web3.utils.fromWei(priceOfOneAugurInUSDC)
    );

    let priceOfOneLinkInUSDC = await oracle.viewUnderlyingAssetPriceOfUSDC(
      link.address,
      web3.utils.toWei("1")
    );
    console.log(
      "the price of one USDC in link is: " +
        web3.utils.fromWei(priceOfOneLinkInUSDC)
    );
  });
  ///////////////////////////////////////////////////////////////////////////////////
  it("should return the right amount of Link for ART", async () => {
    await link.approve(linkMMI.address, "1000000000000000000000000", {
      from: account_one,
    });
    let linkb4bal = await link.balanceOf(account_one);
    await linkMMI.lendToAHRpool(web3.utils.toWei("1000"), {from: account_one});
    await linkMMI.lendToALRpool(web3.utils.toWei("1000"), {from: account_one});
    let linkAHRbal = await linkAHR.balanceOf(account_one);
    let linkALRbal = await linkALR.balanceOf(account_one);
    let linkAfterLend = await link.balanceOf(account_one);

    await linkAHR.redeem(linkAHRbal, {
      from: account_one,
    });
    await linkALR.redeem(linkALRbal, {
      from: account_one,
    });
    let linkAfterRedeem = await link.balanceOf(account_one);
    assert.equal(
      web3.utils.fromWei(linkb4bal),
      web3.utils.fromWei(linkAfterRedeem)
    );
  });
  ///////////////////////////////////////////////////////////////////////////////////
  it("should return the right amount of ART for each lend", async () => {
    await link.approve(linkMMI.address, "1000000000000000000000000", {
      from: account_one,
    });
    await linkMMI.lendToAHRpool(web3.utils.toWei("1000"), {from: account_one});
    await linkMMI.lendToALRpool(web3.utils.toWei("1000"), {from: account_one});
    let linkAHRbal = await linkAHR.balanceOf(account_one);
    let linkALRbal = await linkALR.balanceOf(account_one);
    let linkBalafter = await link.balanceOf(account_one);
    assert.equal(linkAHRbal, web3.utils.toWei("1000"));
    console.log(
      "Link AHR bal after first lend: " + web3.utils.fromWei(linkAHRbal)
    );
    assert.equal(linkALRbal, web3.utils.toWei("1000"));
    console.log(
      "Link AHR bal after first lend: " + web3.utils.fromWei(linkAHRbal)
    );
    await linkMMI.lendToAHRpool(web3.utils.toWei("1000"), {from: account_one});
    await linkMMI.lendToALRpool(web3.utils.toWei("1000"), {from: account_one});
    linkAHRbal = await linkAHR.balanceOf(account_one);
    linkALRbal = await linkALR.balanceOf(account_one);
    console.log(
      "Link AHR bal after second lend: " + web3.utils.fromWei(linkAHRbal)
    );
    console.log(
      "Link AHR bal after second lend: " + web3.utils.fromWei(linkAHRbal)
    );
    assert.equal(linkAHRbal, web3.utils.toWei("1500"));
    assert.equal(linkALRbal, web3.utils.toWei("1500"));
  });

  ///////////////////////////////////////////////////////////////////////////////////
  it("should check that conversions from ALR to asset and asset to ALR are working correctly", async () => {
    let alrValueOF100Asset = await linkALR.viewConvertToART(
      web3.utils.toWei("100")
    );

    console.log(
      "100 Link in ALR is: " + web3.utils.fromWei(alrValueOF100Asset, "ether")
    );

    let assetValueOfAlr = await linkALR.viewConvertFromART(alrValueOF100Asset);

    console.log(
      web3.utils.fromWei(alrValueOF100Asset, "ether") + " of LinkALR is: "
    );
    console.log(web3.utils.fromWei(assetValueOfAlr, "ether") + " of Link");
    console.log("small losses in conversion are due to rounding!");
  });
  ///////////////////////////////////////////////////////////////////////////////////
  it("should allow us to borrow link with collateralized augur", async () => {
    await augur.approve(augurMMI.address, "1000000000000000000000000", {
      from: account_one,
    });
    let linkBalbefore = await link.balanceOf(account_one);

    let augurCollateral = await MMC.viewCollateral(
      account_one,
      augurALR.address
    );
    let augurlockedCollateral = await MMC.viewLockedcollateral(
      account_one,
      augurALR.address
    );
    console.log(
      "Augur Collateral ALR before collateralize: " +
        web3.utils.fromWei(augurCollateral, "ether")
    );
    console.log(
      "Augur Locked Collateral ALR before collateralize: " +
        web3.utils.fromWei(augurlockedCollateral, "ether")
    );

    await augurMMI.lendToAHRpool(web3.utils.toWei("1000"), {
      from: account_one,
    });
    await augurMMI.lendToALRpool(web3.utils.toWei("1000"), {
      from: account_one,
    });
    await augurMMI.lendToAHRpool(web3.utils.toWei("1000"), {
      from: account_one,
    });
    await augurMMI.lendToALRpool(web3.utils.toWei("1000"), {
      from: account_one,
    });
    await augurMMI.lendToAHRpool(web3.utils.toWei("1000"), {
      from: account_one,
    });
    await augurMMI.lendToALRpool(web3.utils.toWei("1000"), {
      from: account_one,
    });
    await augurMMI.collateralizeALR(web3.utils.toWei("100"), {
      from: account_one,
    });

    augurCollateral = await MMC.viewCollateral(account_one, augurALR.address);
    augurlockedCollateral = await MMC.viewLockedcollateral(
      account_one,
      augurALR.address
    );
    console.log(
      "Augur Collateral ALR after collateralize: " +
        web3.utils.fromWei(augurCollateral, "ether")
    );
    console.log(
      "Augur Locked Collateral ALR after collateralize: " +
        web3.utils.fromWei(augurlockedCollateral, "ether")
    );

    await linkMMI.borrow(web3.utils.toWei("50"), augurALR.address, {
      from: account_one,
    });

    augurCollateral = await MMC.viewCollateral(account_one, augurALR.address);
    augurlockedCollateral = await MMC.viewLockedcollateral(
      account_one,
      augurALR.address
    );
    console.log(
      "Augur Collateral ALR after borrow: " +
        web3.utils.fromWei(augurCollateral, "ether")
    );
    console.log(
      "Augur Locked Collateral ALR after borrow: " +
        web3.utils.fromWei(augurlockedCollateral, "ether")
    );

    let linkBalAfter = await link.balanceOf(account_one);
    console.log(
      "link balance before borrow " + web3.utils.fromWei(linkBalbefore, "ether")
    );
    console.log(
      "link balance after borrow " + web3.utils.fromWei(linkBalAfter, "ether")
    );
    assert.notEqual(
      web3.utils.fromWei(linkBalbefore, "ether"),
      web3.utils.fromWei(linkBalAfter, "ether")
    );
    console.log("50 link borrowed successfully");
    let lockedAugurCollateralValInLinkMMI = await linkMMI.viewLockedCollateralizedALR(
      account_one
    );
    console.log(
      "Augur ALR Locked as collateral in Link MMI: " +
        web3.utils.fromWei(lockedAugurCollateralValInLinkMMI, "ether")
    );
    let assetValueOfAugAlr = await augurALR.viewConvertFromART(
      lockedAugurCollateralValInLinkMMI
    );

    console.log(
      "Augur value of augur ALR Locked as collateral in Link MMI: " +
        web3.utils.fromWei(assetValueOfAugAlr, "ether")
    );

    /////////////////////////////////////test borrow fail///////////////////
    //    console.log("borrow 50 more");
    //  await linkMMI.borrow(web3.utils.toWei("50"), augurALR.address, {
    //      from: account_one,
    //    });
    //    linkBalAfter = await link.balanceOf(account_one);
    //    console.log(
    //      "link balance after borrow " + web3.utils.fromWei(linkBalAfter, "ether")
    //    );
    //    lockedAugurCollateralValInLinkMMI = await linkMMI.viewLockedCollateralizedALR(
    //      account_one
    //    );
    //    console.log(
    //      "Augur ALR Locked as collateral in Link MMI: " +
    //        web3.utils.fromWei(lockedAugurCollateralValInLinkMMI, "ether")
    //   );
  });
  ///////////////////////////////////////////////////////////////////////////////////
  it("should return the price of the collateralized Link ALR token in USDC", async () => {
    let priceOf50Link = await oracle.viewUnderlyingPriceofAsset(
      link.address,
      web3.utils.toWei("50")
    );
    console.log(
      "the price of 50 link is: " + web3.utils.fromWei(priceOf50Link) + "USDC"
    ); ////returns 50 link === 500 USDC

    let oneUSDCOfART = await linkALR.viewUSDCWorthOfART(priceOf50Link, {
      from: account_one,
    });
    console.log(
      "50 Link worth of Link ALR token priced in USDC: " +
        web3.utils.fromWei(oneUSDCOfART, "ether")
    );
  });
  ///////////////////////////////////////////////////////////////////////////////////
  it("should allow us to repay our augur loan and unlock our link ALR collateral", async () => {
    let linkBalbefore = await link.balanceOf(account_one);
    let augurBalbefore = await augur.balanceOf(account_one);
    console.log(
      "Augur bal before repay: " + web3.utils.fromWei(augurBalbefore, "ether")
    );
    let augurALRbalb4 = await augurALR.balanceOf(account_one);
    console.log(
      "Augur ALR bal before repay: " +
        web3.utils.fromWei(augurALRbalb4, "ether")
    );
    let linkBorrowedAHR = await linkAHR.borrowBalancePrior(account_one);
    console.log(
      "Link AHR borrow bal before repay: " +
        web3.utils.fromWei(linkBorrowedAHR, "ether")
    );
    let linkBorrowedALR = await linkALR.borrowBalancePrior(account_one);
    console.log(
      "Link ALR borrow bal before repay: " +
        web3.utils.fromWei(linkBorrowedALR, "ether")
    );

    await utils.increaseTime(ONE_YEAR);
    console.log("lending 1000 link to each pool to trigger interest accrual");
    await linkMMI.lendToAHRpool(web3.utils.toWei("1000"), {from: account_one});
    await linkMMI.lendToALRpool(web3.utils.toWei("1000"), {from: account_one});
    let linkBalAfterLoan = await link.balanceOf(account_one);
    console.log("Repaying 20 Link");
    await linkMMI.repay(web3.utils.toWei("20"), {
      from: account_one,
    });
    let linkBorrowedAHRafter = await linkAHR.borrowBalancePrior(account_one);
    console.log(
      "Link AHR borrow bal after 20 repay: " +
        web3.utils.fromWei(linkBorrowedAHRafter, "ether")
    );
    let linkBorrowedALRafter = await linkALR.borrowBalancePrior(account_one);
    console.log(
      "Link ALR borrow bal after 20 repay: " +
        web3.utils.fromWei(linkBorrowedALRafter, "ether")
    );
    let linkBalAfter20 = await link.balanceOf(account_one);
    console.log("Repaying rest of Link loan");
    await linkMMI.repay(web3.utils.toWei("0"), {
      from: account_one,
    });
    linkBorrowedAHRafter = await linkAHR.borrowBalancePrior(account_one);
    console.log(
      "Link AHR borrow bal after full repay: " +
        web3.utils.fromWei(linkBorrowedAHRafter, "ether")
    );
    linkBorrowedALRafter = await linkALR.borrowBalancePrior(account_one);
    console.log(
      "Link ALR borrow bal after full repay: " +
        web3.utils.fromWei(linkBorrowedALRafter, "ether")
    );
    console.log(
      "Link bal before repay: " + web3.utils.fromWei(linkBalbefore, "ether")
    );
    console.log(
      "Link bal after loaning 2000: " +
        web3.utils.fromWei(linkBalAfterLoan, "ether")
    );
    let linkBalAfterfull = await link.balanceOf(account_one);
    console.log(
      "Link bal after 20 repay: " + web3.utils.fromWei(linkBalAfter20, "ether")
    );
    console.log(
      "Link bal after full repay: " +
        web3.utils.fromWei(linkBalAfterfull, "ether")
    );

    let lockedAugurCollateralValInLinkMMI = await linkMMI.viewLockedCollateralizedALR(
      account_one
    );
    console.log(
      "Augur ALR Locked as collateral in Link MMI after borrow repayed: " +
        web3.utils.fromWei(lockedAugurCollateralValInLinkMMI, "ether")
    );
    augurCollateral = await MMC.viewCollateral(account_one, augurALR.address);
    augurlockedCollateral = await MMC.viewLockedcollateral(
      account_one,
      augurALR.address
    );
    console.log(
      "Augur Collateral ALR after loan repay: " +
        web3.utils.fromWei(augurCollateral, "ether")
    );
    console.log(
      "Augur Locked Collateral ALR after loan repay: " +
        web3.utils.fromWei(augurlockedCollateral, "ether")
    );
  });
});
