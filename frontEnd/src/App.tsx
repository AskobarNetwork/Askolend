import * as React from "react";

// prettier-ignore
import { Route, Router } from "react-router-dom";

import { HomePage } from "./pages";
import { Theme } from "@material-ui/core/styles";
import { history } from "./configureStore";
import { makeStyles } from "@material-ui/styles";
import { withRoot } from "./withRoot";

function Routes() {
	const classes = useStyles();

	return (
		<div className={classes.content}>
			<Route exact={true} path="/" component={HomePage} />
		</div>
	);
}

function App() {
	const classes = useStyles();
	// const [mobileOpen, setMobileOpen] = React.useState(true);
	// const todoList = useSelector((state: RootState) => state.todoList);
	// Throws: TypeError: theme is null
	//const isMobile = useMediaQuery((theme: Theme) =>
	//	theme.breakpoints.down("sm")
	//);

	return (
		<Router history={history}>
			<div className={classes.root}>
				<div className={classes.appFrame}>
					<Routes />
				</div>
			</div>
		</Router>
	);
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		width: "100%",
		height: "100%",
		zIndex: 1,
		overflow: "hidden",
	},
	appFrame: {
		position: "relative",
		display: "flex",
		width: "100%",
		height: "100%",
	},
	navIconHide: {
		[theme.breakpoints.up("md")]: {
			display: "none",
		},
	},
	content: {
		backgroundColor: theme.palette.background.default,
		width: "100%",
		height: "calc(100% - 56px)",
		marginTop: 56,
		[theme.breakpoints.up("sm")]: {
			height: "calc(100% - 64px)",
			marginTop: 64,
		},
	},
}));

export default withRoot(App);
