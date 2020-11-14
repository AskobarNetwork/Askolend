import { Contract } from "ethers";
import Fortmatic from "fortmatic";
import { MoneyMarketControlService } from "services/MoneyMarketControl";
import { ProtocolProvider } from "../web3";
import { getTokenData, resetTokens } from "./askoToken";

export const MONEYMARKET_GETINSTANCES_START = "MONEYMARKET_GETINSTANCES_START";
export const MONEYMARKET_GETINSTANCES_FINISH =
	"MONEYMARKET_GETINSTANCES_FINISH";

function gettingInstances() {
	return { type: MONEYMARKET_GETINSTANCES_START, instances: [] };
}

function instancesFound(instances: any) {
	return { type: MONEYMARKET_GETINSTANCES_FINISH, instances: instances };
}

const controlAddress = "0x919f366Eb79BC5405B8F9AE9c812dFB9b0C9138D";

export function getMoneyMarketInstances() {
	return async function (dispatch: any) {
		dispatch(gettingInstances());

		const eth = await ProtocolProvider.getInstance();
		const control = new MoneyMarketControlService(eth, controlAddress);
		const instances = await control.getInstances();

		dispatch(instancesFound(instances));
		dispatch(resetTokens());

		for (const instance of instances) {
			dispatch(getTokenData(instance));
		}
	};
}
