import { Avatar, Grid, Typography } from "@material-ui/core";
import {
	CollateralDialog,
	ConfirmationDialog,
	SupplyDialog,
	BorrowDialog,
} from "../components";
import _ from "lodash";
import Paper from "@material-ui/core/Paper";
import React, { Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { connect } from "react-redux";
import { getTokenLogoPngSrc, Token, SupplyToken } from "../models";
import { ProtocolProvider } from "web3";
import { MoneyMarketControlService } from "services/MoneyMarketControl";
import { MoneyMarketInstanceService } from "services/MoneyMarketInstance";
import { getTokenData } from "actions/askoToken";
import { ERC20Service } from "services/erc20";
import { askoToken } from "reducers/askoToken";
import { setCollateralMarket } from "actions/collateral";

interface TokenMap {
	[moneyMarketAddress: string]: Token;
}

interface IBorrowMarketTableProps {
	tokenInfos?: [];
	moneyMarkets?: [];
	askoTokens?: TokenMap;
	collateralMarket?: string;
	refreshMoneyMarket: Function;
	setCollateralMarket: Function;
}

interface IBorrowMarketTableState {
	tokens: string[];
	addresses: string[];
	control: string;
	//
	collateralopen: boolean;
	confirmationOpen: boolean;
	confirmationTitle: string;
	selectedToken: SupplyToken | undefined;
	borrowOpen: boolean;

}

class BorrowMarketTableClass extends React.Component<
	IBorrowMarketTableProps,
	IBorrowMarketTableState
> {
	constructor(props: any) {
		super(props);
		this.state = {
			// testing only: must fetch this data dynamically
			tokens: ["FakeLink", "FakeAugur"],
			addresses: [
				"0x42e3a2720497153a02Def9a413AdB2a02CCDed28",
				"0xD8f9A6e9d0cF5BF339b8ACf62B47fFE5947bd36E",
			],
			control: "0x91E96c82eE5b6C673080d5801608FBEFE17C1Bfe",
			collateralopen: false,
			confirmationOpen: false,
			confirmationTitle: "",
			selectedToken: undefined,
			borrowOpen: false,
		};
		// console.log("MARKETCHECK!! ",this.props.market)
	}

	componentDidMount = async () => {
		// const provider = await ProtocolProvider.getInstance();
		// const moneyMarket = new MoneyMarketInstanceService(
		// 	provider,
		// 	this.state.addresses[0])
		// const ALR = await provider.
	};

	mountRun = async () => {
		// const provider = await ProtocolProvider.getInstance();
		// const moneyMarket = new MoneyMarketInstanceService(
		// 	provider,
		// 	this.state.addresses[0]
		// );
		// console.log("MONEYMARKET! ", moneyMarket);

		// console.log("PROPS!! ", this.props);
	};



	borrowClick = (event: React.MouseEvent, token: any) => {
		console.log("TOKEN_BORROWCLICK", token);
		this.props.refreshMoneyMarket(token.marketAddress);
		this.setState({
			borrowOpen: !this.state.borrowOpen,
			selectedToken: token,
		});
	};

	borrowClose = () => {
		this.setState({ borrowOpen: false });
	};

	borrow = async () => {
		console.log("BORROW FIRE");
		const provider = await ProtocolProvider.getInstance();
		
	};

	borrowEnable = async () => {
		console.log("BORROW_ENABLE FIRE");
	};

	render() {
		{
			this.mountRun();
		}
		// const supplyTokens: SupplyToken[] = this.createSupplyTokenList(
		// 	this.props.moneyMarkets,
		// 	this.props.askoTokens
		// );

		return (
			<Fragment>
				{/* <ConfirmationDialog
					{...{
						confirmationClose: null,
						confirmationOpen: null,
						title: null,
					}}
				/>
				<CollateralDialog
					{...{
						collateralClose: null,
						collateralSet: null,
						collateralOpen: null,
						token: null,
					}}
				/>
				<SupplyDialog
					{...{
						supply: null,
						supplyClose: null,
						supplyEnable: null,
						supplyOpen: null,
						token: null,
						withdraw: null,
					}}
				/> */}
				<BorrowDialog
					{...{
						borrow: this.borrow,
						borrowClose: this.borrowClose,
						borrowEnable: this.borrowEnable,
						borrowOpen: this.state.borrowOpen,
						token: this.state.selectedToken,
						collateralAddress: this.props.collateralMarket
					}}
				/>

				<TableContainer component={Paper}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Asset</TableCell>
								<TableCell align="right">APY</TableCell>
								<TableCell align="center">Borrowing</TableCell>
								<TableCell align="right">Liquidity</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{console.log("PROPS2!! ", this.props)}
							{console.log("ASOTOKENS!!", this.props.askoTokens)}
							{_.values(this.props.askoTokens!).map((token, i) =>
								console.log("TOKEN ", i, "!! ", token)
							)}
							{_.values(this.props.askoTokens!)
								.slice(1)
								.map((token, i) => (
									<TableRow
										hover={true}
										key={i}
										onClick={(event) => {
											event.stopPropagation();
											this.borrowClick(event, token);
										}}
									>
										<TableCell align="left">
											<Grid
												container
												direction="row"
												justify="flex-start"
												alignItems="center"
											>
												<Avatar
													src={getTokenLogoPngSrc(token.address)}
													alt={token.asset}
												/>{" "}
												&nbsp;
												<Typography>{token.asset}</Typography>
											</Grid>
										</TableCell>
										<TableCell align="right">
											{Number(token.lowRiskBorrowAPY) + "%"}
										</TableCell>
										<TableCell align="center">{token.borrowedAmount}</TableCell>
										<TableCell align="right">
											{"$" +
												(Number(token.lowRiskBalance) *
													Number(token.lowRiskExchangeRate) +
													Number(token.highRiskBalance) *
														Number(token.highRiskExchangeRate))}
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</Fragment>
		);
	}
}

const mapStateToProps = (state: any) => {
	return {
		// tokenInfos: state.tokenInfos,
		moneyMarkets: state.moneyMarket.instances,
		askoTokens: state.askoToken.tokens,
		collateralMarket: state.collateral.market,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		refreshMoneyMarket: (market: string) => {
			dispatch(getTokenData(market));
		},
		setCollateralMarket: (market: string) => {
			dispatch(setCollateralMarket(market));
		},
	};
};

const BorrowMarketTable = connect(
	mapStateToProps,
	mapDispatchToProps
)(BorrowMarketTableClass);

export { BorrowMarketTable };
