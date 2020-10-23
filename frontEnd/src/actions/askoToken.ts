import { Contract } from 'ethers';
import Fortmatic from 'fortmatic';
import { createToken, Token } from 'models';
import { MoneyMarketControlService } from 'services/MoneyMarketControl';
import { MoneyMarketInstanceService } from 'services/MoneyMarketInstance';
import { ProtocolProvider } from '../web3';

export const ASKOTOKEN_CLEAR = 'ASKOTOKEN_CLEAR'
export const ASKOTOKEN_SETTYPES = 'ASKOTOKEN_SETTYPE'
export const ASKOTOKEN_RETRIEVED = 'ASKOTOKEN_RETRIEVED'


export function resetTokens() {
    return async function (dispatch: any) {
        dispatch({type: ASKOTOKEN_CLEAR, tokens: {} })
      }
}

export function getTokenData(marketAddress: string) {
    return async function (dispatch: any) {
        const provider = await ProtocolProvider.getInstance();
        const token = await createToken(new MoneyMarketInstanceService(provider, marketAddress));

        dispatch(tokenDataRetrieved(marketAddress, token))
    }
}

function tokenDataRetrieved(market: string, token: Token) {
    return {type: ASKOTOKEN_RETRIEVED, market, token};
}
