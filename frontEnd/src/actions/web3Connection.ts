import Fortmatic from "fortmatic";
// import Web3 from 'web3';

export const WEB3_ACCOUNTS_CHANGED = "WEB3_ACCOUNTS_CHANGED";
export const WEB3_CHAIN_CHANGED = "WEB3_CHAIN_CHANGED";
export const WEB3_CONNECT = "WEB3_CONNECT";
export const WEB3_CONNECTED = "WEB3_CONNECTED";
export const WEB3_DISCONNECTED = "WEB3_DISCONNECTED";
export const WEB3_MODAL_TOGGLE = "WEB3_MODAL_TOGGLE";

function web3Connect() {
	return { type: WEB3_CONNECT, connected: false };
}

type Web3 = any;

function web3Connected(web3: Web3) {
	return { type: WEB3_CONNECTED, connected: true, web3 };
}

export function makeWeb3Connection(fortmaticApiKey: string) {
	return function (dispatch: any) {
		dispatch(web3Connect());
		const fm = new Fortmatic(fortmaticApiKey);
		// Post EIP-1102 update which MetaMask no longer injects web3
		// @ts-ignore
		if (window.ethereum) {
			// Use MetaMask provider
			// @ts-ignore
			// window.web3 = new Web3(window.ethereum);
		} else {
			// Use Fortmatic provider
			// @ts-ignore
			// window.web3 = new Web3(fm.getProvider());
			// @ts-ignore
			window.web3.currentProvider.enable();
		}

		// Legacy dApp browsers which web3 is still being injected
		// @ts-ignore
		if (typeof web3 !== "undefined") {
			// Use injected provider
			// @ts-ignore
			window.web3 = new Web3(web3.currentProvider);
		} else {
			// Use Fortmatic provider
			// @ts-ignore
			window.web3 = new Web3(fm.getProvider());
			// @ts-ignore
			window.web3.currentProvider.enable();
		}
		console.log("WINDOW ", window);

		// @ts-ignore
		if (window.web3 !== undefined || window.Web3 !== null) {
			// @ts-ignore
			dispatch(web3Connected(window.Web3));
		}
	};
}
