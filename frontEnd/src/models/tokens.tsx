export class Token {
    address: string;
    asset: string;
    apy: string;
    collateral: boolean;
    githubAssetBaseAddress: URL = new URL('https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/')
    liquidity: string;
    wallet: string;

    constructor(address: string, 
        asset: string, 
        apy: string, 
        collateral: boolean, 
        liquidity: string, 
        wallet: string,
        ) {
        this.address = address;
        this.asset = asset;
        this.apy = apy;
        this.collateral = collateral;
        this.liquidity = liquidity;
        this.wallet = wallet;
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
            '0x0D8775F648430679A709E98d2b0Cb6250d2887EF', 'Basic Attention Token', '10.52%', false, '0 BAT', '$4.06M'
        ),
        new Token(
            '0x6B175474E89094C44Da98b954EedeAC495271d0F', 'Dai', '3.03%', false, '0 DAI', '$189.48M'
        ),
        new Token(
            '6907f29be8f8c377394dee0c2eb473782047be83', 'Ether', '0.20%', false, '0 ETH', '$375.54M'
        ),
        new Token(
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 'USD Coin', '1.89%', false, '0 USDC', '$127.10M'
        ),
        new Token(
            '0xdAC17F958D2ee523a2206206994597C13D831ec7', 'Tether', '2.75%', false, '0 USDT', '$4.63M'
        ),
        new Token(
            '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 'Wrapped BTC', '0.97%', false, '0 WBTC', '$13.11M'
        ),
        new Token(
            '0xE41d2489571d322189246DaFA5ebDe1F4699F498', '0x', '1.92%', false, '0 ZRX', '$52.67M'
        ),
    ];
    return tokenArray;
}