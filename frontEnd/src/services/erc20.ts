import { Contract, ethers, BigNumber, providers } from 'ethers'
import { isContract, isAddress } from 'utils/tools'
import { AssetToken } from 'utils/types'
import { ProtocolProvider } from 'web3'


class ERC20Service {
  contract: Contract

  constructor(public provider: ProtocolProvider, controlAddress: string) {
    this.contract = provider.getContract("ERC20", controlAddress)
}

  get address(): string {
    return this.contract.address
  }

  /**
   * @returns A boolean indicating if `spender` has enough allowance to transfer `neededAmount` tokens from `spender`.
   */
  hasEnoughAllowance = async (owner: string, spender: string, neededAmount: BigNumber): Promise<boolean> => {
    const allowance: BigNumber = await this.contract.allowance(owner, spender)
    return allowance.gte(neededAmount)
  }

  /**
   * @returns The allowance given by `owner` to `spender`.
   */
  allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return this.contract.allowance(owner, spender)
  }

  /**
   * Approve `spender` to transfer `amount` tokens on behalf of the connected user.
   */
  approve = async (spender: string, amount: BigNumber): Promise<providers.TransactionReceipt> => {
    const transactionObject = await this.contract.approve(spender, amount, {
      value: '0x0',
    })

    return (await this.provider.getProvider()).waitForTransaction(transactionObject.hash)
  }

  /**
   * Approve `spender` to transfer an "unlimited" amount of tokens on behalf of the connected user.
   */
  approveUnlimited = async (spender: string): Promise<providers.TransactionReceipt> => {
    const transactionObject = await this.contract.approve(spender, ethers.constants.MaxUint256, {
      value: '0x0',
    })

    return (await this.provider.getProvider()).waitForTransaction(transactionObject.hash)
  }


  hasEnoughBalanceToFund = async (owner: string, amount: BigNumber): Promise<boolean> => {
    const balance: BigNumber = await this.contract.balanceOf(owner)

    return balance.gte(amount)
  }

  isValidErc20 = async (): Promise<boolean> => {
    try {
      if (!isAddress(this.contract.address)) {
        throw new Error('Is not a valid erc20 address')
      }

      if (!isContract(this.provider, this.contract.address)) {
        throw new Error('Is not a valid contract')
      }

      const [decimals, symbol] = await Promise.all([this.contract.decimals(), this.contract.symbol()])

      return !!(decimals && symbol)
    } catch (err) {
      return false
    }
  }

  getProfileSummary = async (): Promise<AssetToken> => {
    let decimals
    let symbol
    try {
      ;[decimals, symbol] = await Promise.all([this.contract.decimals(), this.contract.symbol()])
    } catch {
      decimals = 18
      symbol = 'XYZ'
    }

    return {
      address: this.contract.address,
      decimals,
      symbol,
    }
  }
}

export { ERC20Service }
