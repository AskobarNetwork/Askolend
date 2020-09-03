import { History } from "history";
import { combineReducers } from "redux";
import { web3 } from "./web3"

export default (history: History) =>
	combineReducers({
		web3
	});
