import { Avatar, Grid, Switch, Typography } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function createData(icon: any, asset: string, apy: string, wallet: string, collateral: boolean) {
    return { icon, asset, apy, wallet, collateral };
}

const rows = [
    createData(<Avatar src={
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0D8775F648430679A709E98d2b0Cb6250d2887EF/logo.png'
    } alt='' />, 'Basic Attention Token', '10.52%', '0 BAT', false),
    createData(<Avatar src={
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
    } alt='' />, 'Dai', '3.03%', '0 DAI', false),
    createData(<Avatar src={
        'https://raw.githubusercontent.com/trustwallet/assets/6907f29be8f8c377394dee0c2eb473782047be83/blockchains/ethereum/info/logo.png'
    } alt='' />, 'Ether', '0.20%', '0 ETH', false),
    createData(<Avatar src={
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
    } alt='' />, 'USD Coin', '1.89%', '0 USDC', false),
    createData(<Avatar src={
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
    } alt='' />, 'Tether', '2.75%', '0 USDT', false),
    createData(<Avatar src={
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
    } alt='' />, 'Wrapped BTC', '0.97%', '0 WBTC', false),
    createData(<Avatar src={
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png'
    } alt='' />, '0x', '1.92%', '0 ZRX', false),
];

export function SupplyMarketTable() {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Asset</TableCell>
                        <TableCell align='right'>APY</TableCell>
                        <TableCell align='right'>Wallet</TableCell>
                        <TableCell align='right'>Collateral</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.asset}>
                            <TableCell align='left'>
                                <Grid
                                    container
                                    direction='row'
                                    justify='flex-start'
                                    alignItems='center'
                                >
                                    {row.icon} &nbsp;
                                    <Typography>{row.asset}</Typography>
                                </Grid>
                            </TableCell>
                            <TableCell align='right'>{row.apy}</TableCell>
                            <TableCell align='right'>{row.wallet}</TableCell>
                            <TableCell align='right'>
                                <Switch defaultChecked={row.collateral}></Switch>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}