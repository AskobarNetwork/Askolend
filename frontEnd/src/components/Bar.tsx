import React, { ReactElement } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
});

const walletDisplay = <Button color="secondary" variant="contained">
    walletDisplay
</Button>

interface IBarProps {
    classes: any,
}

interface IBarState {
    button: ReactElement,
}

class BarClass extends React.Component<IBarProps, IBarState>  {
    constructor(props: any) {
        super(props);
        this.state = {
            button: this.walletDisplay()
        };
    }

    swapButtons = () => {
        this.setState({ button: walletDisplay });
    }

    walletButton = () => {
        return <Button color="secondary" variant="contained" onClick={() => this.setState({ button: this.walletDisplay() })}>
            Connect Wallet
        </Button>;
    }

    walletDisplay = () => {
        return <Button color="secondary" variant="contained" onClick={() => this.setState({ button: this.walletButton() })}>
            Wallet Info
        </Button>;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Grid
                            container
                            direction="row"
                            justify="space-around"
                            alignItems="center"
                        >
                            <Grid>
                                <Typography variant="h4" className={classes.title}>
                                    <img src={"favicon32x32.png"} alt="" /> Askolend
                            </Typography>
                            </Grid>
                            <Grid>
                                {this.state.button}
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}


var Bar: any = withStyles(styles)(BarClass);
export { Bar };