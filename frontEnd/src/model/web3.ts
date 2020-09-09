import { IProviderOptions } from "web3modal"

export interface IWeb3ConnectionParameters {
    cacheProvider: boolean,
    disableInjectedProvider: boolean,
    network: string,
    providerOptions: IProviderOptions,
}