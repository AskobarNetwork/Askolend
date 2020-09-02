import * as React from "react";

import { Grid, Paper, Typography } from "@material-ui/core";

import { MarketTable } from "./MarketTable";
import { Summary } from "."

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
					<Grid
						direction="column"
					>
						<Typography variant="h6" >
							Supply Markets
						</Typography>
						<MarketTable />
					</Grid>
				</Grid>
				<Grid>
					<Grid
						alignItems="center"
						direction="column"
					>
						<Typography variant="h6" >
							Borrow Markets
						</Typography>
						<MarketTable />
					</Grid>
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
