import { IProviderOptions } from "web3modal"

export interface IWeb3ConnectionParameters {
    cacheProvider: boolean,
    network: string,
    providerOptions: IProviderOptions,
}