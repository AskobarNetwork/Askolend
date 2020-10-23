import { Contract } from "ethers";
import { Token } from "models";
import { ProtocolProvider } from "web3";

export class MoneyMarketInstanceService {
    contract: Contract;

    constructor(public provider: ProtocolProvider, address: string) {
        this.contract = provider.getContract("MoneyMarketInstance", address)
    }

    get address(): string {
        return this.contract.address;
    }

    getAsset = async (): Promise<string> => {
        return await this.contract.getAssetAdd();
    }

    getHighRisk = async(): Promise<string> => {
        return await this.contract.AHR();
    }

    getLowRisk = async(): Promise<string> => {
        return await this.contract.ALR();
    }

    getAssetName = async(): Promise<string> => {
        return await this.contract.assetName();
    }

    getName = async(): Promise<string> => {
        return await this.contract.name();
    }
}
