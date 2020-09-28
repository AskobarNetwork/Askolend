import { TOKEN_INFO_INITIAL_OBTAIN, TOKEN_INFO_OBTAINED, TOKEN_INFO_OBTAINING_ERROR } from "../actions"

import { Token } from '../models'

const initialState: any = {
    tokenAddress: '',
    tokenInfos: [],
    tokenInfo: undefined,
    tokenInfoObtained: false,
    tokenInfoObtaining: false,
    tokenInfoObtainingError: undefined,
}

export function tokenInfo(state = initialState, action: any) {
    switch (action.type) {
        case TOKEN_INFO_INITIAL_OBTAIN:
            return Object.assign({}, state, initialState);
        case TOKEN_INFO_OBTAINED:
            let newTokenInfos = state.tokenInfos === undefined? []: state.tokenInfos.slice();
            newTokenInfos.push({
                key: action.tokenAddress,
                value: new Token(
                    action.tokenAddress, action.tokenInfo?.name, 0, false, 0
                ),
            });
            return Object.assign({}, state, {
                tokenInfos: newTokenInfos
            });
        case TOKEN_INFO_OBTAINING_ERROR:
            return Object.assign({}, state, {
                tokenInfoObtainingError: action.tokenInfoObtainingError,
            });
        default:
            return state;
    }
}