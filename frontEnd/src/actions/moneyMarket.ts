import { Contract } from 'ethers';
import Fortmatic from 'fortmatic';
import { MoneyMarketControlService } from 'services/MoneyMarketControl';
import { ProtocolProvider } from '../web3';
import { getTokenData, resetTokens } from './askoToken';

export const MONEYMARKET_GETINSTANCES_START = 'MONEYMARKET_GETINSTANCES_START'
export const MONEYMARKET_GETINSTANCES_FINISH = 'MONEYMARKET_GETINSTANCES_FINISH'


function gettingInstances() {
  return { type: MONEYMARKET_GETINSTANCES_START, instances: [] }
}

function instancesFound(instances: any) {
  return { type: MONEYMARKET_GETINSTANCES_FINISH, instances: instances }
}

export function getMoneyMarketInstances() {
  return async function (dispatch: any) {
    dispatch(gettingInstances());

    const eth = await ProtocolProvider.getInstance();
    const control = new MoneyMarketControlService(eth, "0xB4693b9732003C1448be473702b2Ee0611dcb165");
    const instances = await control.getInstances();

    dispatch(instancesFound(instances));
    dispatch(resetTokens());

    for (const instance of instances) {
      dispatch(getTokenData(instance));
    }
  }
}