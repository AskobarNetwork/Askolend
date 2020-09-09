import { WEB3_CONNECTED, WEB3_DISCONNECTED, WEB3_MODAL_TOGGLE } from "../actions"

const initialState: any = {
    connected: false,
    modalShown: false,
    provider: undefined,
    web3: undefined,
    web3Modal: undefined
}

export function web3Connector(state = initialState, action: any) {
    switch (action.type) {
        case WEB3_CONNECTED:
            return Object.assign({}, state, {
                connected: action.connected,
                provider: action.provider,
                web3: action.web3,
                web3Modal: action.web3Modal
            });
        case WEB3_DISCONNECTED:
            return Object.assign({}, state, initialState);
        case WEB3_MODAL_TOGGLE:
            return Object.assign({}, state, {
                connected: action.connected,
                provider: action.provider,
                web3: action.web3,
                web3Modal: action.web3Modal,
                modalShown: true,
            });
        default:
            return state;
    }
}