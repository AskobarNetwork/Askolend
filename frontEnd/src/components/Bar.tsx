import { Avatar, Grid } from '@material-ui/core';
import React, { ReactElement } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    small: {
        maxWidth: '15px',
        maxHeight: '15px',
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
            button: this.walletButton()
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
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Button color="secondary" variant="contained" onClick={() => this.setState({ button: this.walletButton() })}>
                    0.0000 &nbsp; <Avatar src={"favicon32x32.png"} alt="" className={classes.small} />
                </Button>
                &nbsp;
                <Button color="secondary" variant="contained" onClick={() => this.setState({ button: this.walletButton() })}>
                    0x00...0000
                </Button>
            </React.Fragment>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Grid
                            alignItems="center"
                            container
                            direction="row"
                            justify="space-between"
                        >
                            <Grid>
                                <Typography variant="h4" className={classes.title} noWrap display={"block"}>
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