import { BigNumber, Contract } from "ethers";
import { ProtocolProvider } from "web3";
import { ERC20Service } from "./erc20";


export class AskoRiskTokenService extends ERC20Service {

    constructor(provider: ProtocolProvider, controlAddress: string)
    {
        super(provider, controlAddress)
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

    balanceOfUnderlying = async (owner: string): Promise<BigNumber> => {
        return await this.contract.balanceOfUnderlyingPrior(owner);
    }

    borrowBalancePrior = async (owner: string): Promise<BigNumber> => {
        return await this.contract.borrowBalancePrior(owner);
    }

    balanceOfUnderlyingPrior = async (owner: string): Promise<BigNumber> => {
        return await this.contract.balanceOfUnderlyingPrior(owner);
    }

    getCash = async (): Promise<BigNumber> => {
        return await this.getCash();
    }

    withdraw = async (amount: BigNumber): Promise<void> => {
        const transactionObject = await this.contract.redeem(amount);

        (await this.provider.getProvider()).waitForTransaction(transactionObject.hash)
    }
}
