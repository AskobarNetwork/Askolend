import * as React from "react";

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
	}
});

function Routes() {
	const classes = useStyles();

	return (
		<ThemeProvider theme={outerTheme}>
			<CssBaseline>
				<div className={classes.content}>
					<Route exact={true} path="/" component={HomePage} />
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
