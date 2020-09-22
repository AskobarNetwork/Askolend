import * as React from "react";

import { Box, Grid, Paper, Typography } from "@material-ui/core";

import { BorrowMarketTable } from "./BorrowMarketTable";
import { Summary } from "."
import { SupplyMarketTable } from "./SupplyMarketTable";

export function HomeBox() {
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