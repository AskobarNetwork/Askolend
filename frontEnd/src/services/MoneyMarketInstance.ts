import { BigNumber, Contract, providers } from "ethers";
import { Token } from "models";
import { ProtocolProvider } from "../web3";

export class MoneyMarketInstanceService {
	contract: Contract;

	constructor(public provider: ProtocolProvider, address: string) {
		this.contract = provider.getContract("MoneyMarketInstance", address);
	}

	get address(): string {
		return this.contract.address;
	}

	getAsset = async (): Promise<string> => {
		return await this.contract.getAssetAdd();
	};

	getHighRisk = async (): Promise<string> => {
		return await this.contract.AHR();
	};

	getLowRisk = async (): Promise<string> => {
		return await this.contract.ALR();
	};

	getAssetName = async (): Promise<string> => {
		return await this.contract.assetName();
	};

	getName = async (): Promise<string> => {
		return await this.contract.name();
	};

	supplyALRPool = async (
		amount: BigNumber
	): Promise<providers.TransactionReceipt> => {
		const transactionObject = await this.contract.lendToALRpool(amount);

		return (await this.provider.getProvider()).waitForTransaction(
			transactionObject.hash
		);
	};

	supplyAHRPool = async (
		amount: BigNumber
	): Promise<providers.TransactionReceipt> => {
		const transactionObject = await this.contract.lendToAHRpool(amount);

		return (await this.provider.getProvider()).waitForTransaction(
			transactionObject.hash
		);
	};

	calculateFee = async (
		amount: BigNumber,
		fee: BigNumber
	): Promise<BigNumber> => {
		return await this.contract.calculateFee(amount, fee);
	};

	getAHRFee = async (): Promise<BigNumber> => {
		return await this.contract.fee_AHR();
	};

	getALRFee = async (): Promise<BigNumber> => {
		return await this.contract.fee_ALR();
	};

	getDivisor = async (): Promise<BigNumber> => {
		return await this.contract.divisor();
	};

	// getBorrowBalALR = async (
	// 	address: String
	// ): Promise<providers.TransactionReceipt> => {
	// 	const transactionObject = await this.contract.ALR().BorrowBalanceCurrent(address);

	// 	return (await this.provider.getProvider()).waitForTransaction(
	// 		transactionObject.hash
	// 	);
	// };


	// getBorrowBalAHR = async (
	// 	address: String
	// ): Promise<providers.TransactionReceipt> => {
	// 	const transactionObject = await this.contract.AHR().BorrowBalanceCurrent(address);

	// 	return (await this.provider.getProvider()).waitForTransaction(
	// 		transactionObject.hash
	// 	);
	// };

	getBorrow = async (
		amount: BigNumber,
		collateralAddress: String
	): Promise<providers.TransactionReceipt> => {

		console.log(amount," ",collateralAddress);
		console.log("CONTRACT", this.contract)

		// const transactionObject = await this.contract.borrow(amount, collateralAddress);

		
		const transactionObject = await this.contract.borrow(amount, collateralAddress);

		console.log("BORROWINSTANCE")

		return (await this.provider.getProvider()).waitForTransaction(
			transactionObject.hash
		);
	};

	getRepay = async (
		amount: BigNumber,
	): Promise<providers.TransactionReceipt> => {
		const transactionObject = await this.contract.repay(amount);

		return (await this.provider.getProvider()).waitForTransaction(
			transactionObject.hash
		);
	};

	setCollateral = async (
		amount:BigNumber
	): Promise<providers.TransactionReceipt> => {
		const transactionObject = await this.contract.collateralizeALR(amount);

		return (await (await this.provider.getProvider()).waitForTransaction(
			transactionObject.hash
		))
	}

}
