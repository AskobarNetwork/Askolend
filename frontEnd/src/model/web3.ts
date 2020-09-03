import { IProviderOptions } from "web3modal"
import Web3 from "web3";
import Web3Modal from "web3modal";

export interface IWeb3Connection {
    cacheProvider: boolean,
    network: string,
    provider: any | undefined,
    providerOptions: IProviderOptions,
    web3Modal: Web3Modal | undefined,
    web3: Web3 | undefined,
}

export interface IWeb3ConnectionParameters {
    cacheProvider: boolean,
    network: string,
    providerOptions: IProviderOptions,
}