import { ASKOTOKEN_CLEAR, ASKOTOKEN_RETRIEVED } from "actions/askoToken";

const initialState: any = {
    instances: []
}

export function askoToken(state = initialState, action: any) {
    switch (action.type) {
        case ASKOTOKEN_CLEAR:
            return Object.assign({}, state, {
                tokens: {}
            });
        case ASKOTOKEN_RETRIEVED:
            const market = action.market;
            const token = action.token;

            const currentTokens = Object.assign({}, state.tokens);
            currentTokens[market] = token;

            return Object.assign({}, state, {
                tokens: currentTokens
            });
        default:
            return state;
    }
}