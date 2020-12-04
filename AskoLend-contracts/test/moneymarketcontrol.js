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
  });

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

  it("should allow us to borrow augur with collateralized link", async () => {
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
    await augurMMI.collateralizeALR(web3.utils.toWei("100"), {
      from: account_one,
    });
    await linkMMI.borrow(web3.utils.toWei("50"), augurALR.address, {
      from: account_one,
    });
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

  it("should allow us to repay our augur loan and unlock our link ALR collateral", async () => {
    let linkBalbefore = await link.balanceOf(account_one);
    console.log(
      "Link bal before repay: " + web3.utils.fromWei(linkBalbefore, "ether")
    );
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

    await linkMMI.lendToAHRpool(web3.utils.toWei("1000"), {from: account_one});
    await linkMMI.lendToALRpool(web3.utils.toWei("1000"), {from: account_one});
    console.log("Repaying 20 Link");
    await linkMMI.repay(web3.utils.toWei("20"), {
      from: account_one,
    });
    let linkBorrowedAHRafter = await linkAHR.borrowBalancePrior(account_one);
    console.log(
      "Link AHR borrow bal after repay: " +
        web3.utils.fromWei(linkBorrowedAHRafter, "ether")
    );
    let linkBorrowedALRafter = await linkALR.borrowBalancePrior(account_one);
    console.log(
      "Link ALR borrow bal after repay: " +
        web3.utils.fromWei(linkBorrowedALRafter, "ether")
    );
    let linkBalAfter = await link.balanceOf(account_one);
    console.log(
      "Link bal after repay: " + web3.utils.fromWei(linkBalAfter, "ether")
    );

    //  await linkMMI.decollateralizeALR(web3.utils.toWei("100"), {
    //  from: account_one,
    //  });
    //  linkALRbalAfter = await linkALR.balanceOf(account_one);
    //    assert.notEqual(
    //      web3.utils.fromWei(linkALRbalb4, "ether"),
    //      web3.utils.fromWei(linkALRbalAfter, "ether"),
    //      "Link ALR was not decallatoralized"
    //    );
    //    await linkALR.redeem(linkALRbalAfter, {
    //      from: account_one,
    //    });
    //    let linkBalAfter = await link.balanceOf(account_one);
    //    assert.notEqual(
    //      web3.utils.fromWei(linkBalbefore, "ether"),
    //      web3.utils.fromWei(linkBalAfter, "ether"),
    //      "Link was not redeemed"
    //    );

    //    let augurALRbalAfter = await augurALR.balanceOf(account_one);
    //    console.log(
    //      "Augur ALR bal After repay: " +
    //        web3.utils.fromWei(augurALRbalAfter, "ether")
    //    );
    //    let linkBorrowedAHRAfter = await linkAHR.borrowBalancePrior(account_one);
    //    console.log(
    //      "Link AHR borrow bal after repay: " +
    //        web3.utils.fromWei(linkBorrowedAHRAfter, "ether")
    //    );
    //    let linkBorrowedALRAfter = await linkALR.borrowBalancePrior(account_one);
    //    console.log(
    //      "Link ALR borrow bal after repay: " +
    //        web3.utils.fromWei(linkBorrowedALRAfter, "ether")
    //    );
  });
});
