import * as React from "react";

import { HomeBox } from "../components";
import { makeStyles } from "@material-ui/styles";

export function HomePage() {
	const classes = useStyles();
	const [boxColor, /*setBoxColor*/] = React.useState("red");

	return (
		<div className={classes.root}>
			<div className={classes.centerContainer}>
				<HomeBox size={300} color={boxColor} />
			</div>
		</div>
	);
}

const useStyles = makeStyles({
	root: {
	},

	centerContainer: {
	},

	button: {
	},
});
