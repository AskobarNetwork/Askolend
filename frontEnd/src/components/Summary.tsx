import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

export function Summary() {
    const classes = useStyles();

    return (
        <div className={classes.summary}>
            <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
            >
                <Grid
                    direction="column"
                >
                    <Typography variant="h5" gutterBottom>
                        Supply Balance
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        $0
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Net APY
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        --
                    </Typography>
                </Grid>
                <Grid
                    direction="column"
                >
                    <Typography variant="h5" gutterBottom>
                        Borrow Balance
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        $0
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Borrow Limit
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        0%
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    summary: {
        flexGrow: 1,
        padding: '30px',
    },
}));