import { WEB3_CONNECTED, WEB3_DISCONNECTED } from "../actions"

const initialState: any = {
    connected: false,
    web3Modal: undefined,
    provider: undefined,
    web3: undefined
}

export function web3Connector(state = initialState, action: any) {
    switch (action.type) {
        case WEB3_CONNECTED:
            return Object.assign({}, state, {
                connected: action.connected,
                web3Modal: action.web3Modal,
                provider: action.provider,
                web3: action.web3
            });
        case WEB3_DISCONNECTED:
            return Object.assign({}, state, initialState);
        default:
            return state;
    }
}