import * as localforage from "localforage";

import { PersistConfig, createTransform, persistReducer, persistStore } from "redux-persist";
import { applyMiddleware, createStore } from "redux";

// @ts-ignore
import JSOG from 'jsog'
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from "history";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";
import thunk from "redux-thunk";

export const JSOGTransform = createTransform(
	(inboundState: any, key: any) => JSOG.encode(inboundState),
	(outboundState: any, key: any) => JSOG.decode(outboundState),
)

const persistConfig: PersistConfig<any> = {
	key: "root",
	version: 1,
	storage: localforage,
	blacklist: [],
	transforms: [JSOGTransform]
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

	return { store, persistor };
};

export { history };
