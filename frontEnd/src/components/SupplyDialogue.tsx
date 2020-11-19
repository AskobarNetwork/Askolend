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

import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { SupplyToken, Token } from "../models";
import { connect } from "react-redux";
import { getTokenLogoPngSrc } from "../models";
import { withStyles } from "@material-ui/styles";
import { ProtocolProvider } from "web3";

const styles = (theme: any) => ({
	supplyDialog: {
		textAlign: "center",
	},
});

interface ISupplyDialogProps {
	supply: Function;
	supplyClose: Function;
	supplyEnable: Function;
	supplyOpen: boolean;
	token: SupplyToken | undefined;
	withdraw: Function;
	classes?: any;
}

interface ISupplyDialogState {
	amount: number;
	supply: boolean;
	value: string;
}

class SupplyDialogClass extends React.Component<
	ISupplyDialogProps,
	ISupplyDialogState
> {
	constructor(props: any) {
		super(props);
		this.state = {
			amount: 0,
			supply: true,
			value: "1",
		};
		this.handleChange.bind(this);
	}

	supplyEnable = (title: string) => {
		this.props.supplyClose();
		this.props.supplyEnable(
			!this.props.token?.token.supplyEnabled,
			this.props.token,
			title
		);
	};

	supply = (title: string) => {
		this.props.supplyClose();
		this.props.supply(this.props.token, this.state.amount, title);
	};

	withdraw = (title: string) => {
		this.props.supplyClose();
		console.log("WDT: ",this.props.token, " ",title)
		this.props.withdraw(this.props.token, this.state.amount, title);
	};

	handleChange = (event: any, newValue: any) => {
		this.setState({ supply: !this.state.supply, value: newValue });
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
			this.props.token?.token.supplyEnabled === false &&
			this.state.supply === true ? (
				<Typography variant="subtitle1">
					To supply or repay {this.props.token?.title} you must enable it first.
				</Typography>
			) : (
				<React.Fragment>
					<Typography variant="subtitle1">
						{this.state.supply ? "Supply" : "Withdraw"} {this.state.amount}{" "}
						{this.props.token?.token.name} to the{" "}
						{this.props.token?.lowRisk ? "Low Risk" : "High Risk"} Market.
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
				className={this.props.classes.supplyDialog}
				open={this.props.supplyOpen}
				onClose={() => this.props.supplyClose()}
				transitionDuration={0}
				onClick={(event) => event.stopPropagation()}
				hideBackdrop={true}
				fullWidth={true}
			>
				<DialogTitle>
					<Grid container justify="flex-end">
						<IconButton onClick={() => this.props.supplyClose()}>
							<CloseIcon />
						</IconButton>
					</Grid>
					<Grid container direction="row" justify="center" alignItems="center">
						<Avatar
							src={getTokenLogoPngSrc(this.props.token?.token.address || "")}
							alt={this.props.token?.token.asset}
						/>{" "}
						&nbsp;
						<Typography>{this.props.token?.title}</Typography>
					</Grid>
				</DialogTitle>
				<DialogContent className={this.props.classes.tabs}>
					<Grid container direction="column">
						{Message}
						<TabContext value={this.state.value}>
							<TabList onChange={this.handleChange} variant="fullWidth">
								<Tab label="Supply" value="1" />
								<Tab label="Withdraw" value="2" />
							</TabList>
							<TabPanel value="1">
								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Supply APY</TableCell>
											<TableCell>{this.props.token?.apy}%</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TabPanel>
							<TabPanel value="2">
								<Table>
									<TableBody>
										<TableRow>
											<TableCell>Supply APY</TableCell>
											<TableCell>{this.props.token?.apy}%</TableCell>
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
									(this.props.token?.token.supplyEnabled &&
										this.state.amount <= 0) ||
									(!this.state.supply && !this.canWithdraw())
								}
								onClick={() =>
									this.state.supply === true
										? this.props.token?.token.supplyEnabled === false
											? this.supplyEnable(
													`Enable ${this.props.token?.token.asset} as Supply`
											  )
											: this.supply(`Supply ${this.props.token?.token.asset}`)
										: this.withdraw(`Withdraw ${this.props.token?.token.asset}`)
								}
							>
								{this.state.supply === true
									? this.props.token?.token.supplyEnabled === false
										? "Enable"
										: "Supply"
									: "Withdraw"}
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
											{this.state.supply === true
												? "Wallet Balance"
												: "Protocol Balance"}
										</TableCell>
										<TableCell>
											{this.state.supply === true
												? this.props.token?.wallet
												: this.props.token?.balance}{" "}
											{this.state.supply === true
												? this.props.token?.token.asset
												: this.props.token?.token.asset +
												  "-" +
												  (this.props.token?.lowRisk ? "LR" : "HR")}
										</TableCell>
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
const UnconnectedSupplyDialogClass: any = withStyles(styles)(SupplyDialogClass);
const SupplyDialog = connect(
	mapStateToProps,
	null
)(UnconnectedSupplyDialogClass);

export { SupplyDialog };
