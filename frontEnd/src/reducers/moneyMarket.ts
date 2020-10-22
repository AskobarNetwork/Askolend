import { MONEYMARKET_GETINSTANCES_FINISH, MONEYMARKET_GETINSTANCES_START } from "../actions"

const initialState: any = {
    instances: {}
}

export function moneyMarket(state = initialState, action: any) {
    switch (action.type) {
        case MONEYMARKET_GETINSTANCES_START:
            return Object.assign({}, state, {
                instances: {}
            });
        case MONEYMARKET_GETINSTANCES_FINISH:
            return Object.assign({}, state, {
                instances: action.instances
            });
        default:
            return state;
    }
}