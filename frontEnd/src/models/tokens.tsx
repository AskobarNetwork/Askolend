export class Token {
    address: string;
    asset: string;
    apy: number;
    collateral: boolean;
    liquidity: number;
    supplyEnabled: boolean;
    supplyApy: number;
    borrowApy: number;
    borrowBalance: number;
    borrowLimit: number;
    borrowLimitUsed: number;

    constructor(address: string,
        asset: string,
        apy: number,
        collateral: boolean,
        liquidity: number,
        supplyEnabled: boolean,
        supplyApy: number,
        borrowApy: number,
        borrowBalance: number,
        borrowLimit: number,
        borrowLimitUsed: number,
    ) {
        this.address = address;
        this.asset = asset;
        this.apy = apy;
        this.collateral = collateral;
        this.liquidity = liquidity;
        this.supplyEnabled = supplyEnabled;
        this.supplyApy = supplyApy;
        this.borrowApy = borrowApy;
        this.borrowBalance = borrowBalance;
        this.borrowLimit = borrowLimit;
        this.borrowLimitUsed = borrowLimitUsed;
    }
}

export function getTokenLogoPngSrc(address: string): string {
    return new URL((process.env.REACT_APP_ASSETS_ENDPOINT || '') + address + '/logo.png').toString();
}