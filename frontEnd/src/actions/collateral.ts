import { Contract } from 'ethers';
import Fortmatic from 'fortmatic';
import { MoneyMarketControlService } from 'services/MoneyMarketControl';
import { ProtocolProvider } from '../web3';
import { getTokenData, resetTokens } from './askoToken';

export const COLLATERAL_SET = 'COLLATERAL/SET'



function setMarket(market: string | undefined) {
  return { type: COLLATERAL_SET, market: market }
}

export function setCollateralMarket(market: string | undefined) {
  return async function (dispatch: any) {
    dispatch(setMarket(market));
  }
}