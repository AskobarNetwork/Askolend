import { Avatar, Grid, Typography } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getTokens } from '../models/'

export function BorrowMarketTable() {
    return (
        <TableContainer component={Paper}>
            <Table aria-label='simple table'>
                <TableHead>
                    <TableRow>
                        <TableCell>Asset</TableCell>
                        <TableCell align='right'>APY</TableCell>
                        <TableCell align='center'>Wallet</TableCell>
                        <TableCell align='right'>Liquidity</TableCell>
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
                            <TableCell align='right'>{token.apy + '%'}</TableCell>
                            <TableCell align='center'>{0 + ' ' + token.abbreviation}</TableCell>
                            <TableCell align='right'>
                                {'$' + token.liquidity + 'M'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}