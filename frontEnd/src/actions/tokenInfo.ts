import axios from 'axios'
import { MoneyMarket } from 'models/moneyMarket';

export const TOKEN_INFO_INITIAL_OBTAIN = 'TOKEN_INFO_INITIAL_OBTAIN';
export const TOKEN_INFO_OBTAINING = 'TOKEN_INFO_OBTAINING';
export const TOKEN_INFO_OBTAINING_ERROR = 'TOKEN_INFO_OBTAINING_ERROR';
export const TOKEN_INFO_OBTAINED = 'TOKEN_INFO_OBTAINED';

function tokenInfoIntialObtain() {
    return { type: TOKEN_INFO_INITIAL_OBTAIN }
}

function tokenInfoObtaining(address: string) {
    return { type: TOKEN_INFO_OBTAINING, tokenInfoObtained: false }
}

function tokenInfoObtainingError(address: string, error: any) {
    return { type: TOKEN_INFO_OBTAINING, tokenAddress: address, tokenInfoObtained: false, tokenInfoObtainingError: error }
}

function tokenInfoObtained(address: string, info: any) {
    return { type: TOKEN_INFO_OBTAINED, tokenAddress: address, tokenInfoObtained: true, tokenInfo: info }
}

export function clearTokens() {
    return async function (dispatch: any) {
        dispatch(tokenInfoIntialObtain());
    }
}

export function obtainTokenInfo(moneymarket: MoneyMarket) {
    return async function (dispatch: any) {
        // if (initialObtain === true) {
        //     dispatch(tokenInfoIntialObtain());
        // }
        //console.log(asset);
        // const address = asset.address;
        // dispatch(tokenInfoObtaining(address));

        // let tokenInfo = undefined;
        // try {
        //     const res = await axios.get(process.env.REACT_APP_ASSETS_ENDPOINT + address + '/info.json');
        //     tokenInfo = res.data;
        // } catch (e) {
        //     tokenInfo = {
        //         name: "aaaaaasjlkdfhjasdlkhfa",
        //         website: "?",
        //         short_description: "",
        //         explorer: "https://etherscan.io/token/" + address
        //     }
        // }


        // // instead of sending TokenInfo, send an actual token

        // dispatch(tokenInfoObtained(address, tokenInfo));
    }
}