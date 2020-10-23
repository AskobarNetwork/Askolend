import { AskoRiskTokenService } from "services/AskoRiskToken";
import { ERC20Service } from "services/erc20";
import { MoneyMarketInstanceService } from "services/MoneyMarketInstance";

export interface Token {

        name: string,
        asset: string,
        address: string, // address of the underlying asset
        highRiskSupplyAPY: number,
        lowRiskSupplyAPY: number,
        lowRiskBorrowAPY: number,
        borrowLimit: number,
        borrowLimitUsed: number,
        borrowedAmount: number,
        supplyEnabled: boolean,
        collateral: boolean,
        marketAddress: string,
        lowRiskAddress: string,
        highRiskAddress: string,
        walletAmount: number,

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
    const highRiskSupplyAPY = (await highRisk.supplyRate()).toNumber();
    const lowRiskSupplyAPY = (await lowRisk.supplyRate()).toNumber();
    const lowRiskBorrowAPY = (await lowRisk.borrowRate()).toNumber();
    
    const asset = await new ERC20Service(provider, address);
    const walletAmount = await asset.getBalance(userAddress);

    let borrowedAmount = 0;
    try {
        borrowedAmount = await lowRisk.borrowBalancePrior(userAddress);
    } catch (ex) {
    }

    return {
        name,
        asset: name,
        address,
        highRiskSupplyAPY,
        lowRiskSupplyAPY,
        lowRiskBorrowAPY,
        borrowLimit: 0, // help,
        borrowLimitUsed: 0, // help,
        borrowedAmount,
        supplyEnabled: false, //help
        collateral: false, // help
        marketAddress: moneyMarket.address,
        lowRiskAddress: lowRisk.address,
        highRiskAddress: highRisk.address
        walletAmount
    } as Token;
    
}

export function getTokenLogoPngSrc(address: string): string {
    return new URL((process.env.REACT_APP_ASSETS_ENDPOINT || '') + address + '/logo.png').toString();
}