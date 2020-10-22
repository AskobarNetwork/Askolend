import { Contract } from 'ethers';
import Fortmatic from 'fortmatic';
import { obtainTokenInfo } from '.';
import { ProtocolProvider } from '../web3';

export const MONEYMARKET_GETINSTANCES_START = 'MONEYMARKET_GETINSTANCES_START'
export const MONEYMARKET_GETINSTANCES_FINISH = 'MONEYMARKET_GETINSTANCES_FINISH'

export interface AskoAsset {
  address: string;
  market: Contract;
  token: Contract;
  ahr: Contract;
  alr: Contract;
}

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
        const ahr = eth.getContract("AskoRiskToken", await market.AHR());
        const alr = eth.getContract("AskoRiskToken", await market.ALR());

        moneyMarketInstances[address] = {
          address,
          token: eth.getContract("ERC20", address),
          market,
          ahr,
          alr
        } as AskoAsset;

        dispatch(obtainTokenInfo(moneyMarketInstances[address]));
    }

    console.log(moneyMarketInstances);

    dispatch(instancesFound(moneyMarketInstances));
  }
}