import { History } from 'history';
import { combineReducers } from 'redux';
import { web3Connector } from './web3Connector'
import { moneyMarket } from './moneyMarket'
import { askoToken } from './askoToken'
import { collateral } from './collateral';

export default (history: History) =>
	combineReducers({
		web3Connector,
		moneyMarket,
		askoToken,
		collateral
	});
