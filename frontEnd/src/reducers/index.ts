import { History } from 'history';
import { combineReducers } from 'redux';
import { web3Connector } from './web3Connector'
import { moneyMarket } from './moneyMarket'

export default (history: History) =>
	combineReducers({
		web3Connector,
		moneyMarket
	});
