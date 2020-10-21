import { Signer, Contract, utils } from "ethers";
import BN from "bn.js";
import { Web3Provider, Provider } from "@ethersproject/providers";
import { Network } from "./types";

const contractAddresses = {
  test: '0xb33f2f17eb9af9309ccbd31d6941ef15268c9e7b'
}

type ContractName = keyof typeof contractAddresses

export class ProtocolProvider {
  private ABI_BASE_ROUTE = "./artifacts";

  public provider: Web3Provider | null = null;
  public signer: Signer | null = null;
  public contractAddresses = contractAddresses

  private static _instance: ProtocolProvider;

  public static fromWei(amount: BN): string {
    const etherAmount = utils.formatEther(amount.toString());
    return etherAmount.toString();
  }
  
  public static toWei(amount: string | number): BN {
    const weiAmount = utils.parseEther(amount.toString());
    return new BN(weiAmount.toString());
  }

  private constructor() { }

  private async initialize() {
    let provider;
    if ((window as any).ethereum) {
      await (window as any).ethereum.enable();
      provider = new Web3Provider((window as any).ethereum);
    } else if ((window as any).web3) {
      provider = (window as any).web3;
    }

    this.signer = await provider.getSigner();
    this.provider = provider;
  }

  public static async getInstance() {
    if (!this._instance) {
      const instance = new ProtocolProvider();
      await instance.initialize();
      this._instance = instance;
    }
    return this._instance;
  }

  public getDefaultAddress = async () => {
    const signer = await this.provider!.getSigner();
    const address = await signer!.getAddress();
    return address;
  };

  public getProvider = async () => {
    return (await this.provider) as Web3Provider;
  };

  public getNetwork = async () => {
    const network = await this.provider?.getNetwork();
    const name = network!.name === "homestead" ? "mainnet" : network!.name;
    return name as Network;
  };

  public getABI = (name: string) => {
    try {
      return require(`${this.ABI_BASE_ROUTE}/${name}.json`);
    } catch (error) {
      throw new Error(`No ABI found with name: ${name}`);
    }
  };

  public getContract = (name: ContractName) => {
    const { abi } = this.getABI(name);
    const address = this.contractAddresses[name];
    return new Contract(address, abi, this.signer as Signer);
  };
}