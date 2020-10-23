import { BigNumber, Contract } from "ethers";
import { ProtocolProvider } from "web3";


export class AskoRiskTokenService {
    contract: Contract;

    constructor(public provider: ProtocolProvider, controlAddress: string) {
        this.contract = provider.getContract("AskoRiskToken", controlAddress)
    }

    get address(): string {
        return this.contract.address;
    }

    getAsset = async (): Promise<string> => {
        return await this.contract.getAssetAdd();
    }

    getExchangeRate = async (): Promise<BigNumber> => {
        return await this.contract.exchangeRatePrior();
    }

    supplyRate = async (): Promise<BigNumber> => {
        return await this.contract.supplyRatePerBlock();
    }

    borrowRate = async (): Promise<BigNumber> => {
        return await this.contract.borrowRatePerBlock();
    }

    balanceOfUnderlying = async (owner: string): Promise<number> => {
        return await this.contract.balanceOfUnderlyingPrior(owner);
    }

    borrowBalancePrior = async (owner: string): Promise<number> => {
        return await this.contract.borrowBalancePrior(owner);
    }
}
