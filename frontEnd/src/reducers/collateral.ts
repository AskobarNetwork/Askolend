import { COLLATERAL_SET } from "actions/collateral";

const initialState: any = {
    market: undefined
}

export function collateral(state = initialState, action: any) {
    switch (action.type) {
        case COLLATERAL_SET:
            return Object.assign({}, state, {
                market: action.market
            });
        default:
            return state;
    }
}