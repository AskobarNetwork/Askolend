import { Grid, Switch, Typography } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    table: {
        maxHeight: 650,
        minWidth: 650,
    },
});

function createData(icon: any, asset: string, apy: string, wallet: string, collateral: boolean) {
    return { icon, asset, apy, wallet, collateral };
}

const rows = [
    createData(<img src={"bat.png"} alt="" />, 'Basic Attention Token', '10.52%', '0 BAT', false),
    createData(<img src={"dai.png"} alt="" />, 'Dai', '3.03%', '0 DAI', false),
    createData(<img src={"favicon32x32.png"} alt="" />, 'Ether', '0.20%', '0 ETH', false),
    createData(<img src={"usdc.png"} alt="" />, 'USD Coin', '1.89%', '0 USDC', false),
    createData(<img src={"tether.png"} alt="" />, 'Tether', '2.75%', '0 USDT', false),
    createData(<img src={"wbtc.png"} alt="" />, 'Wrapped BTC', '0.97%', '0 WBTC', false),
    createData(<img src={"zrx.png"} alt="" />, '0x', '1.92%', '0 ZRX', false),
];

export function SupplyMarketTable() {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Asset</TableCell>
                        <TableCell align="right">APY</TableCell>
                        <TableCell align="right">Wallet</TableCell>
                        <TableCell align="right">Collateral</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.asset}>
                            <TableCell component="th" scope="row">
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="center"
                                >
                                    {row.icon}
                                    <Typography>{row.asset}</Typography>
                                </Grid>
                            </TableCell>
                            <TableCell align="right">{row.apy}</TableCell>
                            <TableCell align="right">{row.wallet}</TableCell>
                            <TableCell align="right">
                                <Switch defaultChecked={row.collateral}></Switch>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}