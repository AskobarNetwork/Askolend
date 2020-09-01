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
        minWidth: 650,
    },
});

function createData(asset: string, apy: string, wallet: string, collateral: boolean) {
    return { asset, apy, wallet, collateral };
}

const rows = [
    createData('Basic Attention Token', '10.52%', '0 BAT', false),
    createData('Dai', '3.03%', '0 DAI', false),
    createData('Ether', '0.20%', '0 ETH', false),
    createData('USD Coin', '1.89%', '0 USDC', false),
    createData('Tether', '2.75%', '0 USDT', false),
    createData('Wrapped BTC', '0.97%', '0 WBTC', false),
    createData('0x', '1.92%', '0 ZRX', false),
];

export function MarketTable() {
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
                                {row.asset}
                            </TableCell>
                            <TableCell align="right">{row.apy}</TableCell>
                            <TableCell align="right">{row.wallet}</TableCell>
                            <TableCell align="right">{row.collateral}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}