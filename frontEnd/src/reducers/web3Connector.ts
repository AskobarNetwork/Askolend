import { WEB3_CONNECTED, WEB3_DISCONNECTED, WEB3_MODAL_TOGGLE } from "../actions"

const initialState: any = {
    connected: false,
    web3: undefined,
}

export function web3Connector(state = initialState, action: any) {
    switch (action.type) {
        case WEB3_CONNECTED:
            return Object.assign({}, state, {
                connected: action.connected,
                web3: action.web3,
            });
        case WEB3_DISCONNECTED:
            return Object.assign({}, state, initialState);
        case WEB3_MODAL_TOGGLE:
            return Object.assign({}, state, {
                connected: action.connected,
                web3: action.web3,
            });
        default:
            return state;
    }
}