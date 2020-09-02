import * as React from "react";

import { Grid, Typography } from "@material-ui/core";
// prettier-ignore
import { Route, Router } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';
import { HomePage } from "./pages";
import { Theme } from "@material-ui/core/styles";
import { history } from "./configureStore";
import { makeStyles } from "@material-ui/styles";
import { withRoot } from "./withRoot";

const outerTheme = createMuiTheme({
	palette: {
		primary: {
			main: "#1a202c"
		},
		secondary: {
			main: "#00c6aa"
		},
		type: 'dark',
		background: {
			default: "#1a202c",
			paper: "#1e2430",
		}
	},
	props: {
		MuiPaper: {
			elevation: 2,
			variant: 'outlined'
		},
	},
	overrides: {
		MuiTableCell: {
			root: {
				padding: '4px 8px',
				lineHeight: '40px',
			},
		},
	},
});

function Routes() {
	const classes = useStyles();

	return (
		<ThemeProvider theme={outerTheme}>
			<CssBaseline>
				<div className={classes.content}>
					<Route exact={true} path="/" component={HomePage} />
					<Grid
						style={{ padding: 10 }}
						container
						direction="column"
						justify="flex-end"
						alignItems="center"
					>
						<Grid item xs={12}>
							<Typography variant="body2">
								Copyright © 2020 Askobar Network. All rights reserved.
							</Typography>
						</Grid>
					</Grid>
				</div>
			</CssBaseline>
		</ThemeProvider>
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
	},
	appFrame: {
	},
	content: {
	},
}));

export default withRoot(App);
