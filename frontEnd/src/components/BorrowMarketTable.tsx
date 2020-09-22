import { Avatar, Grid, Typography } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import BorrowMarketModal from './BorrowMarketModal'
const useStyles = makeStyles({
    table: {
        maxHeight: 650,
        minWidth: 650,
    },
});

function createData(icon: any, asset: string, apy: string, wallet: string, liquidity: string) {
    return { icon, asset, apy, wallet, liquidity };
}

const rows = [
    createData(<Avatar src={"bat.png"} alt="" />, 'Basic Attention Token', '10.52%', '0 BAT', '$4.06M'),
    createData(<Avatar src={"dai.png"} alt="" />, 'Dai', '3.03%', '0 DAI', '$189.48M'),
    createData(<Avatar src={"ether.png"} alt="" />, 'Ether', '0.20%', '0 ETH', '$375.54M'),
    createData(<Avatar src={"usdc.png"} alt="" />, 'USD Coin', '1.89%', '0 USDC', '$127.10M'),
    createData(<Avatar src={"tether.png"} alt="" />, 'Tether', '2.75%', '0 USDT', '$4.63M'),
    createData(<Avatar src={"wbtc.png"} alt="" />, 'Wrapped BTC', '0.97%', '0 WBTC', '$13.11M'),
    createData(<Avatar src={"zrx.png"} alt="" />, '0x', '1.92%', '0 ZRX', '$52.67M'),
];

export function BorrowMarketTable() {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Asset</TableCell>
                        <TableCell align="right">APY</TableCell>
                        <TableCell align="right">Wallet</TableCell>
                        <TableCell align="right">Liquidity</TableCell>
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
                                    {row.icon} &nbsp;
                                    <BorrowMarketModal asset={row.asset} icon={row.icon}/>
                                </Grid>
                            </TableCell>
                            <TableCell align="right">{row.apy}</TableCell>
                            <TableCell align="right">{row.wallet}</TableCell>
                            <TableCell align="right">
                                {row.liquidity}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}