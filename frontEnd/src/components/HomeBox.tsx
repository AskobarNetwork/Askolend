import * as React from "react";

import { Paper } from "@material-ui/core";

interface Props {
	size: number;
	color: "red" | "blue" | string;
}

export function HomeBox(props: Props) {
	const { size, ...other } = props;
	// const classes = useStyles(props);

	return (
		<Paper  {...other}>
		</Paper>
	);
}

/*
const styledBy = (property: string, props: any, mapping: any): string =>
	mapping[props[property]];
const useStyles = makeStyles((theme: Theme) => (
}));
*/
