import { AskoRiskTokenService } from "services/AskoRiskToken";
import { MoneyMarketInstanceService } from "services/MoneyMarketInstance";

export class Token {

    constructor(
        public name: string,
        public address: string, // address of the underlying asset
        public highRiskSupplyAPY: number,
        public lowRiskSupplyAPY: number,
        public lowRiskBorrowAPY: number,
        public borrowLimit: number,
        public borrowLimitUsed: number,
        public borrowedAmount: number,
        public supplyEnabled: boolean,
        public collateral: boolean,
        public marketAddress: string,
        public lowRiskAddress: string,
        public highRiskAddress: string

        // collateral: boolean,
        // liquidity: number,
        // borrowBalance: number,
    ) {
    }
}

export async function createToken(moneyMarket: MoneyMarketInstanceService): Promise<Token> {
    const provider = moneyMarket.provider;
    const highRisk = new AskoRiskTokenService(provider, await moneyMarket.getHighRisk());
    const lowRisk = new AskoRiskTokenService(provider, await moneyMarket.getLowRisk());

    return new Token(
        await moneyMarket.getAssetName(),
        await moneyMarket.getAsset(),
        await highRisk.supplyRate(),
        await lowRisk.supplyRate(),
        await lowRisk.borrowRate(),
        0, // help,
        0, // help,
        await lowRisk.borrowBalancePrior(await provider.getSignerAddress()),
        false, //help
        false, // help
        moneyMarket.address,
        lowRisk.address,
        highRisk.address
    )
    
}

export function getTokenLogoPngSrc(address: string): string {
    return new URL((process.env.REACT_APP_ASSETS_ENDPOINT || '') + address + '/logo.png').toString();
}