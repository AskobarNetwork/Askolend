import * as React from "react";

import { Box, Grid, Paper, Typography } from "@material-ui/core";

import { BorrowMarketTable } from "./BorrowMarketTable";
import { Summary } from "."
import { SupplyMarketTable } from "./SupplyMarketTable";
import { connect } from 'react-redux'
import { getMoneyMarketInstances } from '../actions'
import { ProtocolProvider } from "../web3";

interface IHomeBoxProps {
	obtainMoneyMarket: Function
}

interface IHomeBoxState {

}

class HomeBoxClass extends React.Component<IHomeBoxProps, IHomeBoxState>  {
	componentDidMount = async () => {

		this.props.obtainMoneyMarket();

		// let tokenAddresses = getTokenAddresses();
		// tokenAddresses.forEach((address: string, index: number) => {
		// 	let intialObtain = false;
		// 	if (index === 0) {
		// 		intialObtain = true;
		// 	}
		// 	this.props.obtainTokenInfo(address, intialObtain);
		// });
	}

	render() {
		return (
			<Paper>
				<Summary />
				<Grid
					container
					direction="row"
					justify="space-evenly"
					alignItems="flex-start"
				>
					<Grid item md={6}>
						<Box padding={4}>
							<Typography variant="h6" >
								Supply Markets
						</Typography>
							<SupplyMarketTable />
						</Box>
					</Grid>
					<Grid item md={6}>
						<Box padding={4}>
							<Typography variant="h6" >
								Borrow Markets
						</Typography>
							<BorrowMarketTable />
						</Box>
					</Grid>
				</Grid>
			</Paper>
		);
	}
}


const mapDispatchToProps = (dispatch: any) => {
	return {
		obtainMoneyMarket: (intialObtain: boolean) => {
			dispatch(getMoneyMarketInstances())
		}
	}
}

const HomeBox = connect(null, mapDispatchToProps)(HomeBoxClass)

export { HomeBox };