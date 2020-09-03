import { WEB3_CONNECT, WEB3_CONNECTED, WEB3_DISCONNECTED } from "../actions"

const initialState: any = {
    web3Connection: undefined,
}

export function web3(state = initialState, action: any) {
    switch (action.type) {
        case WEB3_CONNECT:
            return state
        case WEB3_CONNECTED:
            return Object.assign({}, state, {
                web3Connection: state.web3Connection,
            })
        case WEB3_DISCONNECTED:
            return Object.assign({}, state, initialState)
        default:
            return state
    }
}