import { WEB3_CONNECTED, WEB3_DISCONNECTED } from "../actions"

const initialState: any = {
    web3Connection: undefined,
}

export function web3Connector(state = initialState, action: any) {
    switch (action.type) {
        case WEB3_CONNECTED:
            console.log(action.web3)
            return Object.assign({}, state, {
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