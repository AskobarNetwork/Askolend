import { History } from 'history';
import { combineReducers } from 'redux';
import { tokenInfo } from './tokenInfo'
import { web3Connector } from './web3Connector'
import { moneyMarket } from './moneyMarket'

export default (history: History) =>
	combineReducers({
		tokenInfo,
		web3Connector,
		moneyMarket
	});
