import { Avatar, Grid, Switch, Typography } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getTokens } from '../models/'

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
                    {getTokens().map((token) => (
                        <TableRow key={token.asset}>
                            <TableCell align='left'>
                                <Grid
                                    container
                                    direction='row'
                                    justify='flex-start'
                                    alignItems='center'
                                >
                                    <Avatar src={token.logoPngSrc()} alt={token.logoPngSrcAlt()} /> &nbsp;
                                    <Typography>{token.asset}</Typography>
                                </Grid>
                            </TableCell>
                            <TableCell align='right'>{token.apy}</TableCell>
                            <TableCell align='right'>{token.wallet}</TableCell>
                            <TableCell align='right'>
                                <Switch defaultChecked={token.collateral}></Switch>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}