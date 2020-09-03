import { IWeb3Connection, IWeb3ConnectionParameters } from "../model"

import Web3 from "web3";
import Web3Modal from "web3modal";

export const WEB3_ACCOUNTS_CHANGED = 'WEB3_ACCOUNTS_CHANGED'
export const WEB3_CHAIN_CHANGED = 'WEB3_CHAIN_CHANGED'
export const WEB3_CONNECT = 'WEB3_CONNECT'
export const WEB3_CONNECTED = 'WEB3_CONNECTED'
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED'

function web3Connect() {
  return { type: WEB3_CONNECT }
}

function web3Connected(web3Connection: IWeb3Connection) {
  return { type: WEB3_CONNECTED, web3Connection }
}

export function makeWeb3Connection(web3ConnectionParameters: IWeb3ConnectionParameters) {
  return function (dispatch: any) {
    dispatch(web3Connect());
    var web3Connection: IWeb3Connection = {
      network: web3ConnectionParameters.network,
      cacheProvider: web3ConnectionParameters.cacheProvider,
      providerOptions: web3ConnectionParameters.providerOptions,
      web3Modal: undefined,
      provider: {},
      web3: undefined,
    }
    web3Connection.web3Modal = new Web3Modal({
      network: web3Connection.network,
      cacheProvider: web3Connection.cacheProvider,
      providerOptions: web3Connection.providerOptions
    });
    web3Connection.web3Modal.connect().then((provider) => {
      web3Connection.provider = provider
      web3Connection.web3 = new Web3(web3Connection.provider);
      dispatch(web3Connected(web3Connection));
    });
  }
}