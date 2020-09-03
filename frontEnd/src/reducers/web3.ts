import { WEB3_CONNECT, WEB3_DISCONNECT } from "../actions"

import Web3Modal from "web3modal";

interface IState {
    provider: any,
    providerOptions: any,
    web3Modal: Web3Modal,
    web3: any,
}

const initialState: IState = {
    providerOptions: undefined,
    web3Modal: new Web3Modal(),
    provider: undefined,
    web3: undefined,
}

export function web3(state: IState = initialState, action: any) {
    switch (action.type) {
        case WEB3_CONNECT:
            return Object.assign({}, state, {
                provider: state.provider,
                providerOptions: state.providerOptions,
                web3Modal: state.web3Modal,
                web3: state.web3,
            })
        case WEB3_DISCONNECT:
            return Object.assign({}, state, initialState)
        default:
            return state
    }
}