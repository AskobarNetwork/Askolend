/*
 * action types
 */

export const WEB3_ACCOUNTS_CHANGED = 'WEB3_ACCOUNTS_CHANGED'
export const WEB3_CHAIN_CHANGED = 'WEB3_CHAIN_CHANGED'
export const WEB3_CONNECT = 'WEB3_CONNECT'
export const WEB3_DISCONNECT = 'WEB3_DISCONNECT'

/*
 * action creators
 */

export function web3Connect() {
  return { type: WEB3_CONNECT }
}

export function web3Disconnect() {
  return { type: WEB3_DISCONNECT }
}
