export class Token {
    abbreviation: string;
    address: string;
    asset: string;
    apy: number;
    collateral: boolean;
    githubAssetBaseAddress: URL = new URL('https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/')
    liquidity: number;

    constructor(abbreviation: string,
        address: string,
        asset: string,
        apy: number,
        collateral: boolean,
        liquidity: number,
    ) {
        this.abbreviation = abbreviation
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

export function getTokens() {
    let tokenArray: Token[] = [
        new Token(
            'BAT', '0x0D8775F648430679A709E98d2b0Cb6250d2887EF', 'Basic Attention Token', 10.52, false, 4.06
        ),
        new Token(
            'DAI', '0x6B175474E89094C44Da98b954EedeAC495271d0F', 'Dai', 3.03, false, 189.48
        ),
        new Token(
            'USDC', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'USD Coin', 1.89, false, 127.10
        ),
        new Token(
            'USDT', '0xdAC17F958D2ee523a2206206994597C13D831ec7', 'Tether', 2.75, false, 4.63
        ),
        new Token(
            'WBTC', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 'Wrapped BTC', 0.97, false, 13.11
        ),
        new Token(
            'ZRX', '0xE41d2489571d322189246DaFA5ebDe1F4699F498', '0x', 1.92, false, 52.67
        ),
    ];
    return tokenArray;
}