import { Contract } from 'ethers';
import Fortmatic from 'fortmatic';
import { MoneyMarket } from 'models/moneyMarket';
import { obtainTokenInfo } from '.';
import { ProtocolProvider } from '../web3';

export const MONEYMARKET_GETINSTANCES_START = 'MONEYMARKET_GETINSTANCES_START'
export const MONEYMARKET_GETINSTANCES_FINISH = 'MONEYMARKET_GETINSTANCES_FINISH'


function gettingInstances() {
  return { type: MONEYMARKET_GETINSTANCES_START, instances: {} }
}

function instancesFound(instances: any) {
  return { type: MONEYMARKET_GETINSTANCES_FINISH, instances: instances }
}

export function getMoneyMarketInstances() {
  return async function (dispatch: any) {
    dispatch(gettingInstances());

    const eth = await ProtocolProvider.getInstance();
    const moneyMarketControl = eth.getContract("MoneyMarketControl", "0xB4693b9732003C1448be473702b2Ee0611dcb165");
    const assetAddresses: string[] = await moneyMarketControl.getAssets();
    const moneyMarketInstances: any = {};
    for (let address of assetAddresses) {
      const instanceAddress = await moneyMarketControl.instanceTracker(address);
      const market = eth.getContract("MoneyMarketInstance", instanceAddress);
      const assetAddress = await market.getAssetAdd();
      const ahr = await market.AHR();
      const alr = await market.ALR();
      const assetName = await market.assetName();

      const newMarket = new MoneyMarket(assetName, instanceAddress, assetAddress, ahr, alr);
      moneyMarketInstances[assetName] = newMarket;
    }

    dispatch(instancesFound(moneyMarketInstances));
  }
}