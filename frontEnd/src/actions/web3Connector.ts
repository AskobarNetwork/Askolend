import Web3Modal, { IProviderInfo } from "web3modal";

import { IWeb3ConnectionParameters } from "../model"
import Web3 from "web3";

export const WEB3_ACCOUNTS_CHANGED = 'WEB3_ACCOUNTS_CHANGED'
export const WEB3_CHAIN_CHANGED = 'WEB3_CHAIN_CHANGED'
export const WEB3_CONNECT = 'WEB3_CONNECT'
export const WEB3_CONNECTED = 'WEB3_CONNECTED'
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED'
export const WEB3_MODAL_TOGGLE = 'WEB3_MODAL_TOGGLE'

function web3Connect() {
  return { type: WEB3_CONNECT, connected: false }
}

function web3Connected(web3Modal: Web3Modal, provider: IProviderInfo, web3: Web3) {
  return { type: WEB3_CONNECTED, connected: true, web3Modal, provider, web3 }
}

function web3ModalShown() {
  return { type: WEB3_MODAL_TOGGLE }
}

export function makeWeb3Connection(web3ConnectionParameters: IWeb3ConnectionParameters) {
  return function (dispatch: any) {
    dispatch(web3Connect());
    var web3Modal = new Web3Modal({
      cacheProvider: web3ConnectionParameters.cacheProvider,
      disableInjectedProvider: web3ConnectionParameters.disableInjectedProvider,
      network: web3ConnectionParameters.network,
      providerOptions: web3ConnectionParameters.providerOptions
    });

    web3Modal.connect().then((provider) => {
      var web3 = new Web3(provider);
      dispatch(web3Connected(web3Modal, provider, web3));
      if (web3ConnectionParameters.disableInjectedProvider === true) {
        web3Modal.toggleModal().then(() => {
          dispatch(web3ModalShown());
        })
      }
    });
  }
}