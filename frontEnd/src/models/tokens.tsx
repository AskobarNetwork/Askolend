export class Token {
    address: string;
    asset: string;
    apy: number;
    collateral: boolean;
    githubAssetBaseAddress: URL = new URL(process.env.REACT_APP_ASSETS_ENDPOINT || '')
    liquidity: number;

    constructor(address: string,
        asset: string,
        apy: number,
        collateral: boolean,
        liquidity: number,
    ) {
        this.address = address;
        this.asset = asset;
        this.apy = apy;
        this.collateral = collateral;
        this.liquidity = liquidity;
    }

    infoJsonSrc(): string {
        return new URL(this.githubAssetBaseAddress.toString() + this.address + '/info.json').toString();
    }

    logoPngSrc(): string {
        return new URL(this.githubAssetBaseAddress.toString() + this.address + '/logo.png').toString();
    }

    logoPngSrcAlt(): string {
        return this.asset;
    }
}

export function getTokenAddresses() {
    let tokenArray: string[] = [
        '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
    ];
    return tokenArray;
}