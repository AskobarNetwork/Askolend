import {
	Avatar,
	Button,
	DialogActions,
	DialogContent,
	Grid,
	IconButton,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableRow,
	TextField,
	Typography,
} from "@material-ui/core";
import { BigNumber, ethers } from "ethers";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { SupplyToken, Token } from "../models";
import { MoneyMarketInstanceService } from "services/MoneyMarketInstance";
import { connect } from "react-redux";
import { getTokenLogoPngSrc } from "../models";
import { withStyles } from "@material-ui/styles";
import { ProtocolProvider } from "web3";

const styles = (theme: any) => ({
	borrowDialog: {
		textAlign: "center",
	},
});

interface IBorrowDialogProps {
	borrow: Function;
	repay: Function;
	borrowClose: Function;
	borrowEnable: Function;
	borrowOpen: boolean;
	token: any | undefined;
	withdraw: Function;
	classes?: any;
	collateralAddress?: string;
}

interface IBorrowDialogState {
	amount: number;
	borrow: boolean;
	value: string;
}

class BorrowDialogClass extends React.Component<
	IBorrowDialogProps,
	IBorrowDialogState
> {
	constructor(props: any) {
		super(props);
		this.state = {
			amount: 0,
			borrow: true,
			value: "1",
		};
		this.handleChange.bind(this);
		this.borrowCall.bind(this)
	}

	borrowEnable = (title: string) => {
		this.props.borrowClose();
		this.props.borrowEnable(
			!this.props.token?.token.supplyEnabled,
			this.props.token,
			title
		);
		console.log("SUPPLY ENABLED ",this.props.token?.token.supplyEnabled)
		console.log("BORROW ENABLED ",this.props.token?.token.borrowEnabled)

	};

	borrow = (title: string) => {
		this.props.borrowClose();
		this.props.borrow(this.props.token, this.state.amount, title);
	};

	repay = (title: string) => {
		this.props.borrowClose();
		this.props.repay(this.props.token, this.state.amount, title);
	};

	borrowCall =  async () => {
		const provider = await ProtocolProvider.getInstance();
		const moneyMarket = new MoneyMarketInstanceService(
			provider,
			this.props.token?.marketAddress
		);
		// ^^ which address is used here?
		console.log("MARKETADDRESS! ",this.props.token?.marketAddress)
		let address = this.props.collateralAddress ? this.props.collateralAddress : "";
		console.log("BORROWCALL1")
		if (address!== "" && address !== undefined){
			console.log(BigNumber.from(this.state.amount));
			console.log(address)
		let x1;
		x1 = await moneyMarket.getBorrow((BigNumber.from(this.state.amount).mul(BigNumber.from(10^18))), address)
		console.log("x1 ",x1)
	}
		console.log("BORROWCALL2")
		// console.log(x1);
	}

	handleChange = (event: any, newValue: any) => {
		this.setState({ borrow: !this.state.borrow, value: newValue });
		console.log("BTOKEN!",this.props.token)
	};

	canWithdraw = (): boolean => {
		if (this.props.token === undefined) {
			return false;
		}
		const withdrawAmount = ProtocolProvider.toWei(this.state.amount);
		const balance = ProtocolProvider.toWei(this.props.token?.balance);

		return withdrawAmount.lte(balance);
	};

	render() {
		const Message =
			this.props.token?.supplyEnabled === false &&
			this.state.borrow === true ? (
				<Typography variant="subtitle1">
					To borrow or repay {this.props.token?.asset} you must enable it first.
				</Typography>
			) : (
				<React.Fragment>
					<Typography variant="subtitle1">
						{this.state.borrow ? "Borrow" : "Repay"} {this.state.amount}{" "}
						{this.props.token?.name}
					</Typography>
					{/* <Typography>{"Current Balance: "} {this.props.token?.balance}</Typography> */}
					<TextField
						type="number"
						value={this.state.amount}
						InputProps={{ inputProps: { min: 0 } }}
						onChange={(event: any) => {
							this.setState({ amount: Number(event.target.value) });
						}}
					/>
				</React.Fragment>
			);

		return (
			<Dialog
				className={this.props.classes.borrowDialog}
				open={this.props.borrowOpen}
				onClose={() => this.props.borrowClose()}
				transitionDuration={0}
				onClick={(event) => event.stopPropagation()}
				hideBackdrop={true}
				fullWidth={true}
			>
				<DialogTitle>
					<Grid container justify="flex-end">
						<IconButton onClick={() => this.props.borrowClose()}>
							<CloseIcon />
						</IconButton>
					</Grid>
					<Grid container direction="row" justify="center" alignItems="center">
						<Avatar
							src={getTokenLogoPngSrc(this.props.token?.address || "")}
							alt={this.props.token?.asset}
						/>{" "}
						&nbsp;
						<Typography>{this.props.token?.asset}</Typography>
					</Grid>
				</DialogTitle>
				<DialogContent className={this.props.classes.tabs}>
					<Grid container direction="column">
						{Message}
						<TabContext value={this.state.value}>
							<TabList onChange={this.handleChange} variant="fullWidth">
								<Tab label="Borrow" value="1" />
								<Tab label="Repay" value="2" />
							</TabList>
							<TabPanel value="1">
								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Borrow APY</TableCell>
											<TableCell>"APY"</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TabPanel>
							<TabPanel value="2">
								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Borrow APY</TableCell>
											<TableCell>"APY"</TableCell>
										</TableRow>
										{/* { this.props.token?.lowRisk ? 
                                        <TableRow>
                                            <TableCell>
                                                Borrow Limit
                                        </TableCell>
                                            <TableCell>
                                                ${0} &#x2192; $0
                                        </TableCell>
                                        </TableRow> : null }
                                        { this.props.token?.lowRisk ? 
                                        <TableRow>
                                            <TableCell>
                                                Borrow Limit Used
                                        </TableCell>
                                            <TableCell>
                                                {0}% &#x2192; 0%
                                        </TableCell>
                                        </TableRow>
                                        : null } */}
									</TableBody>
								</Table>
							</TabPanel>
						</TabContext>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Grid container direction="column">
						<Grid container item xs={12}>
							<Button
								color="secondary"
								fullWidth={true}
								variant="contained"
								disabled={
									(this.props.token?.supplyEnabled && this.state.amount <= 0) ||
									(!this.state.borrow)
									// && !this.canWithdraw()
								}
								onClick={() =>
									this.state.borrow === true
										? this.props.token?.supplyEnabled === false
											? this.borrowEnable(
													`Enable ${this.props.token?.asset} as Supply`
											  )
											: this.borrowCall()
										: this.repay(`Withdraw ${this.props.token?.asset}`)
								}
							>
								{this.state.borrow === true
									? this.props.token?.supplyEnabled === false
										? "Enable"
										: "Borrow"
									: "Repay"}
							</Button>
						</Grid>
						<Table>
							<TableBody>
								<TableRow>
									<Grid
										container
										direction="row"
										justify="space-between"
										alignItems="center"
									>
										<TableCell>
											{this.state.borrow === true
												? "Currently Borrowing"
												: "Wallet Balance"}
										</TableCell>
										<TableCell>PLACEHOLDER</TableCell>
									</Grid>
								</TableRow>
							</TableBody>
						</Table>
					</Grid>
				</DialogActions>
			</Dialog>
		);
	}
}

const mapStateToProps = (state: any) => {
	return {};
};

// @ts-ignore
const UnconnectedBorrowDialogClass: any = withStyles(styles)(BorrowDialogClass);
const BorrowDialog = connect(
	mapStateToProps,
	null
)(UnconnectedBorrowDialogClass);

export { BorrowDialog };
