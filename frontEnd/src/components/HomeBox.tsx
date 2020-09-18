import * as React from "react";

import { Grid, Paper, Typography } from "@material-ui/core";

import { BorrowMarketTable } from "./BorrowMarketTable";
import { Summary } from "."
import { SupplyMarketTable } from "./SupplyMarketTable";

interface Props {
	size: number;
	color: "red" | "blue" | string;
}

export function HomeBox(props: Props) {
	const { size, ...other } = props;
	// const classes = useStyles(props);

	return (
		<Paper  {...other}>
			<Summary />
			<Grid
				container
				direction="row"
				justify="space-evenly"
				alignItems="flex-start"
			>
				<Grid>

					<Typography variant="h6" >
						Supply Markets
						</Typography>
					<SupplyMarketTable />
				</Grid>
				<Grid>
					<Typography variant="h6" >
						Borrow Markets
						</Typography>
					<BorrowMarketTable />
				</Grid>
			</Grid>
		</Paper>
	);
}

/*
const styledBy = (property: string, props: any, mapping: any): string =>
	mapping[props[property]];
const useStyles = makeStyles((theme: Theme) => (
}));
*/
