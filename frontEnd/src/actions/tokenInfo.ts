import axios from 'axios'

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

export function obtainTokenInfo(address: string, initialObtain: boolean) {
    return function (dispatch: any) {
        if (initialObtain == true) {
            dispatch(tokenInfoIntialObtain());
        }
        dispatch(tokenInfoObtaining(address));
        axios.get(process.env.REACT_APP_ASSETS_ENDPOINT + address + '/info.json')
            .then(function (response) {
                dispatch(tokenInfoObtained(address, response.data));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(tokenInfoObtainingError(address, error));
            })
    }
}