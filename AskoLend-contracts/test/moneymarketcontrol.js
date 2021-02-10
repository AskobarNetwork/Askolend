console.log("in tests");
const Web3 = require("web3");
const utils = require("./utils.js");
const truffleAssert = require("truffle-assertions");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const FakeAugur = artifacts.require("FakeAugur");
const FakeLink = artifacts.require("FakeLink");
const FakewETH = artifacts.require("FakewETH");
const MoneyMarketInstance = artifacts.require("MoneyMarketInstance");
const AskoRiskToken = artifacts.require("AskoRiskToken");
const UniswapOracleFactory = artifacts.require("UniswapOracleFactory");
const MoneyMarketControl = artifacts.require("MoneyMarketControl");
const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const UniswapV2Factory = artifacts.require("UniswapV2Factory");

contract("MoneyMarketControl", (accounts) => {
  console.log("starting tests");
  const ONE_DAY = 1000 * 86400;
  const ONE_YEAR = 365 * ONE_DAY;
  let account_one = accounts[0];
  let account_two = accounts[1];
  let augur;
  let link;
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
      "the price of one link is: " + web3.utils.fromWei(priceOfOneLink) + " wETH"
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
      "the price of one augur is: " + web3.utils.fromWei(priceOfOneAugur) + " wETH"
    );
    assert.equal(
      web3.utils.fromWei(priceOfOneAugur),
      "20",
      "Returning the wrong price"
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

    await augurMMI.lendToAHRpool(web3.utils.toWei("1000"), {
      from: account_one,
    });
    await augurMMI.lendToALRpool(web3.utils.toWei("1000"), {
      from: account_one,
    });

    let augurAHRbal = await augurAHR.balanceOf(account_one);
    let augurALRbal = await augurALR.balanceOf(account_one);

    console.log("augur AHR bal: " + web3.utils.fromWei(augurAHRbal));
    console.log("augur ALR bal: " + web3.utils.fromWei(augurALRbal));
    let augurwETHAHRbal = await augurAHR.viewwETHWorthOfART(augurAHRbal);
    let augurwETHALRbal = await augurALR.viewwETHWorthOfART(augurALRbal);

    console.log("augur AHR wETH value: " + web3.utils.fromWei(augurwETHAHRbal));
    console.log("augur ALR wETH value: " + web3.utils.fromWei(augurwETHALRbal));

    augurCollateral = await MMC.viewCollateral(account_one, augurALR.address);

    console.log(
      "Augur Collateral ALR wETH value before borrow: " +
        web3.utils.fromWei(augurCollateral, "ether")
    );

    await linkMMI.borrow(web3.utils.toWei("50"), augurALR.address, {
      from: account_one,
    });

    augurCollateral = await MMC.viewCollateral(account_one, augurALR.address);

    console.log(
      "Augur Collateral ALR wETH value after borrow: " +
        web3.utils.fromWei(augurCollateral, "ether")
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
  });
  /////////////////////////////////////test borrow fail///////////////////
  it("should fail to borrow more than allowed", async () => {
    console.log("borrow 150000 more");
    await truffleAssert.reverts(
      linkMMI.borrow(web3.utils.toWei("150000"), augurALR.address, {
        from: account_one,
      })
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
    augurCollateral = await MMC.viewCollateral(account_one, augurALR.address);

    console.log(
      "Augur Collateral ALR wETH before loan repay: " +
        web3.utils.fromWei(augurCollateral, "ether")
    );
    await utils.increaseTime(ONE_YEAR);
    console.log("lending 3000 link to each pool to trigger interest accrual");
    await linkMMI.lendToAHRpool(web3.utils.toWei("3000"), {from: account_one});
    await linkMMI.lendToALRpool(web3.utils.toWei("3000"), {from: account_one});
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

    augurCollateral = await MMC.viewCollateral(account_one, augurALR.address);

    console.log(
      "Augur Collateral ALR wETH after 20 loan repay: " +
        web3.utils.fromWei(augurCollateral, "ether")
    );
    console.log("Repaying another 20 Link");
    await linkMMI.repay(web3.utils.toWei("20"), {
      from: account_one,
    });
    linkBorrowedAHRafter = await linkAHR.borrowBalancePrior(account_one);
    console.log(
      "Link AHR borrow bal after 20 repay: " +
        web3.utils.fromWei(linkBorrowedAHRafter, "ether")
    );
    linkBorrowedALRafter = await linkALR.borrowBalancePrior(account_one);
    console.log(
      "Link ALR borrow bal after 20 repay: " +
        web3.utils.fromWei(linkBorrowedALRafter, "ether")
    );

    augurCollateral = await MMC.viewCollateral(account_one, augurALR.address);

    console.log(
      "Augur Collateral ALR wETH after 20 loan repay: " +
        web3.utils.fromWei(augurCollateral, "ether")
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

    augurCollateral = await MMC.viewCollateral(account_one, augurALR.address);

    console.log(
      "Augur Collateral ALR wETH after full loan repay: " +
        web3.utils.fromWei(augurCollateral, "ether")
    );
  });
  ///////////////////////////////////////////////////////////////////////////////////

  it("should liquidate a non-compliant account", async () => {
    let linkBorrowedALRb4 = await linkALR.borrowBalancePrior(account_one);
    console.log(
      "Link ALR borrow bal before borrow: " +
        web3.utils.fromWei(linkBorrowedALRb4, "ether")
    );
    let linkBorrowedAHRb4 = await linkAHR.borrowBalancePrior(account_one);
    console.log(
      "Link AHR borrow bal before borrow: " +
        web3.utils.fromWei(linkBorrowedAHRb4, "ether")
    );
    console.log(
      "first we borrow near the max amount of link using our augur as collateral from account one"
    );
    await linkMMI.borrow(
      web3.utils.toWei("1332.333333333333333333"),
      augurALR.address,
      {
        from: account_one,
      }
    );
    console.log("Max amount of link successfully borrowed!");
    console.log("lending assets to augur pools");
    await augur.transfer(account_two, web3.utils.toWei("300000"), {from: account_one})
    await augur.approve(augurMMI.address, web3.utils.toWei("300000"), {from: account_two})
    await augurMMI.lendToAHRpool(web3.utils.toWei("1000"), {from: account_two});
    await augurMMI.lendToALRpool(web3.utils.toWei("1000"), {from: account_two});
    console.log("Augur lent")
     linkBorrowedALRb4 = await linkALR.borrowBalancePrior(account_one);
    console.log(
      "Link ALR borrow bal before time travel: " +
        web3.utils.fromWei(linkBorrowedALRb4, "ether")
    );
     linkBorrowedAHRb4 = await linkAHR.borrowBalancePrior(account_one);
    console.log(
      "Link AHR borrow bal before time travel: " +
        web3.utils.fromWei(linkBorrowedAHRb4, "ether")
    );



    console.log("time to time travel  into the world of tommorow!");
    let numOfBlock = 100;

    for (let block = 0; block < numOfBlock; ++block) {
      await linkALR.accrueInterest();
      await linkAHR.accrueInterest();
    }

    let linkBorrowedALRafter = await linkALR.borrowBalancePrior(account_one);
    console.log(
      "Link ALR borrow bal after time travel: " +
        web3.utils.fromWei(linkBorrowedALRafter, "ether")
    );
    let linkBorrowedAHRafter = await linkAHR.borrowBalancePrior(account_one);
    console.log(
      "Link AHR borrow bal after time travel: " +
        web3.utils.fromWei(linkBorrowedAHRafter, "ether")
    );

    let availibleCollateralValue = await MMC.viewCollateral(account_one, augurALR.address);
    console.log("availible collateral value in wETH for account one: "+ web3.utils.fromWei(availibleCollateralValue, "ether"))
    console.log("Time travel success!!!");
    console.log("Our Loan is now non compliant!");
     let linkBalB4 = await link.balanceOf(linkALR.address)
     let augurBalB4 = await augur.balanceOf(augurALR.address)
     let account2LinkBal = await link.balanceOf(account_two)
     let MMILinkBal = await link.balanceOf(linkMMI.address)

    console.log("link ALR bal b4: " + web3.utils.fromWei(linkBalB4, "ether"))
    console.log("augur ALR bal b4: " + web3.utils.fromWei(augurBalB4, "ether"))
    console.log("account 2 Link bal b4: " + web3.utils.fromWei(account2LinkBal, "ether"))
    console.log("LinkMMI Link bal b4: " + web3.utils.fromWei(MMILinkBal, "ether"))

    await linkMMI.liquidateAccount(account_one, augurALR.address, {
      from: account_two,
    });

    console.log("Account One's loan liquidated");
     let linkBalAfter = await link.balanceOf(linkALR.address)
     let augurBalAfter = await augur.balanceOf(augurALR.address)
     account2LinkBal = await link.balanceOf(account_two)
      MMILinkBal = await link.balanceOf(linkMMI.address)

    console.log("link ALR bal After: " + web3.utils.fromWei(linkBalAfter, "ether"))
    console.log("augur ALR bal After: " + web3.utils.fromWei(augurBalAfter, "ether"))
    console.log("account 2 Link bal after: " + web3.utils.fromWei(account2LinkBal, "ether"))
    console.log("LinkMMI Link bal after: " + web3.utils.fromWei(MMILinkBal, "ether"))

    let linkBorrowedALRafterL = await linkALR.borrowBalancePrior(account_one);
    console.log(
      "User two's Link ALR borrow bal after liquidation: " +
        web3.utils.fromWei(linkBorrowedALRafterL, "ether")
    );


  });
  ///////////////////////////////////////////////////////////////////////////////////
  it("should make sure a user cannot transfer their ART token", async () => {
    linkALRBal = await linkALR.balanceOf(account_one);
    console.log(
      "User two's link balance before transfer attempt: " +
        web3.utils.fromWei(linkALRBal)
    );
    await truffleAssert.reverts(
      linkALR.transfer(account_two, web3.utils.toWei("100"), {
        from: account_one,
      })
    );
    linkALRBal = await linkALR.balanceOf(account_one);
    console.log(
      "User two's link balance after transfer attempt: " +
        web3.utils.fromWei(linkALRBal)
    );
  });
});
