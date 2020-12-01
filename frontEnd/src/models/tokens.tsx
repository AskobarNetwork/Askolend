import { BigNumber, ethers } from "ethers";
import { AskoRiskTokenService } from "services/AskoRiskToken";
import { ERC20Service } from "services/erc20";
import { MoneyMarketInstanceService } from "services/MoneyMarketInstance";
import { ProtocolProvider } from "../../src/web3";
console.log(ProtocolProvider,"PROTOCOL_PROVIDER")

const fromWei = ProtocolProvider.fromWei;

// Asset + Asset-ALR + Asset-AHR
export interface Token {

        name: string,
        asset: string,
        address: string, // address of the underlying asset
        highRiskSupplyAPY: string,
        highRiskBalance: string,
        highRiskExchangeRate: string,
        lowRiskSupplyAPY: string,
        lowRiskBorrowAPY: string,
        lowRiskBalance: string,
        lowRiskExchangeRate: string,
        borrowLimit: string,
        borrowLimitUsed: string,
        borrowedAmount: string,
        supplyEnabled: boolean,
        collateral: boolean,
        marketAddress: string,
        lowRiskAddress: string,
        highRiskAddress: string,
        walletAmount: string,
   

        // collateral: boolean,
        // liquidity: number,
        // borrowBalance: number,
}

export async function createToken(moneyMarket: MoneyMarketInstanceService): Promise<Token> {
    const provider = moneyMarket.provider;
    const highRisk = new AskoRiskTokenService(provider, await moneyMarket.getHighRisk());
    const lowRisk = new AskoRiskTokenService(provider, await moneyMarket.getLowRisk());

    const userAddress = await provider.getSignerAddress();
    const name = await moneyMarket.getAssetName();
    const address = await moneyMarket.getAsset();
    const highRiskSupplyAPY = fromWei(await highRisk.supplyRate());
    const lowRiskSupplyAPY = fromWei(await lowRisk.supplyRate());
    const lowRiskBorrowAPY = fromWei(await lowRisk.borrowRate());

    let lowRiskBalance = fromWei(await lowRisk.getBalance(userAddress));
    let highRiskBalance = fromWei(await highRisk.getBalance(userAddress));

    let lowRiskExchangeRate = "0";
    try {
        lowRiskExchangeRate = fromWei(await lowRisk.getExchangeRate());
    } catch (ex) {
        console.log("get exchange rate failed");
    } 

    const highRiskExchangeRate = fromWei(await highRisk.getExchangeRate());
    
    
    const asset = await new ERC20Service(provider, address);
    const walletAmount = fromWei(await asset.getBalance(userAddress));

    let borrowedAmount = "0";
    try {
        let borrowedALR = fromWei(await lowRisk.borrowBalancePrior(userAddress));
        let borrowedAHR = fromWei(await lowRisk.borrowBalancePrior(userAddress));
        borrowedAmount = (Number(borrowedAHR)+Number(borrowedALR)).toString()
    } catch (ex) {
        console.log("get borrow balance prior")
    }

    const canSupply = await asset.hasEnoughAllowance(userAddress, moneyMarket.address, ethers.constants.MaxUint256.div(2));

    return {
        name,
        asset: name,
        address,
        highRiskSupplyAPY,
        highRiskBalance,
        highRiskExchangeRate,
        lowRiskSupplyAPY,
        lowRiskBorrowAPY,
        lowRiskBalance,
        lowRiskExchangeRate,
        borrowLimit: "0", // help,
        borrowLimitUsed: "0", // help,
        borrowedAmount,
        supplyEnabled: canSupply,
        collateral: false, // help
        marketAddress: moneyMarket.address,
        lowRiskAddress: lowRisk.address,
        highRiskAddress: highRisk.address,
        walletAmount,

    } as Token;
    
}

export function getTokenLogoPngSrc(address: string): string {
    return new URL((process.env.REACT_APP_ASSETS_ENDPOINT || '') + address + '/logo.png').toString();
}