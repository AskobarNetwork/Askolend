import { Avatar, Grid, Switch, Typography } from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { connect } from 'react-redux'
import { getTokenLogoPngSrc } from '../models'

interface ISupplyMarketTableProps {
    tokenInfos?: [],
}

interface ISupplyMarketTableState {

}

class SupplyMarketTableClass extends React.Component<ISupplyMarketTableProps, ISupplyMarketTableState>  {
    render() {
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Asset</TableCell>
                            <TableCell align='right'>APY</TableCell>
                            <TableCell align='center'>Wallet</TableCell>
                            <TableCell align='center'>Collateral</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.tokenInfos?.map((token: any) => (
                            <TableRow key={token.value.asset}>
                                <TableCell align='left'>
                                    <Grid
                                        container
                                        direction='row'
                                        justify='flex-start'
                                        alignItems='center'
                                    >
                                        <Avatar src={getTokenLogoPngSrc(token.value.address)} alt={token.value.asset} /> &nbsp;
                                    <Typography>{token.value.asset}</Typography>
                                    </Grid>
                                </TableCell>
                                <TableCell align='right'>{token.value.apy + '%'}</TableCell>
                                <TableCell align='center'>{0}</TableCell>
                                <TableCell align='center'>
                                    <Switch defaultChecked={token.value.collateral}></Switch>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        tokenInfos: state.tokenInfo.tokenInfos,
    }
}

const SupplyMarketTable = connect(mapStateToProps, null)(SupplyMarketTableClass)

export { SupplyMarketTable };