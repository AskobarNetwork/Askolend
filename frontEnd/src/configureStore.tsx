import * as actions from "./actions"
import * as localforage from "localforage";

import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import { applyMiddleware, createStore } from "redux";

import { IWeb3Connection } from "./model"
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from "history";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import thunk from "redux-thunk";

const persistConfig: PersistConfig<any> = {
	key: "root",
	version: 1,
	storage: localforage,
	blacklist: [],
};

const logger = (createLogger as any)();
const history = createBrowserHistory();

const dev = process.env.NODE_ENV === "development";

let middleware = dev ? applyMiddleware(thunk, logger) : applyMiddleware(thunk);

if (dev) {
	middleware = composeWithDevTools(middleware);
}

const persistedReducer = persistReducer(persistConfig, rootReducer(history));

export default () => {
	const store = createStore(persistedReducer, {}, middleware) as any;
	const persistor = persistStore(store);
	var initialState: IWeb3Connection = {
		network: "mainnet",
		cacheProvider: true,
		providerOptions: {},
		web3Modal: undefined,
		provider: {},
		web3: undefined,
	}
	store.dispatch(actions.makeWeb3Connection(initialState))
	return { store, persistor };
};

export { history };
