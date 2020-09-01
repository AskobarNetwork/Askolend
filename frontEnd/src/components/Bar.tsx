import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export function Bar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Grid
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="center"
                    >
                        <Grid>
                            <Typography variant="h6" className={classes.title}>
                                Askolend
                        </Typography>
                        </Grid>
                        <Grid>
                            <Button color="inherit" variant="outlined">
                                Connect Wallet
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    );
}