import { Contract } from "ethers";
import { ProtocolProvider } from "web3";


export class MoneyMarketControlService {
    contract: Contract;

    constructor(public provider: ProtocolProvider, controlAddress: string) {
        this.contract = provider.getContract("MoneyMarketControl", controlAddress)
    }

    get address(): string {
        return this.contract.address;
    }

    getInstances = async (): Promise<string[]> => {
        const assets = this.contract.getAssets();
        const instances = [];
        for (const asset of assets) {
            instances.push(await this.contract.instanceTracker(asset));
        }

        return instances;
    }
}