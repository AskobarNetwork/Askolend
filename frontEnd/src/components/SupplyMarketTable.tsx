import { Avatar, Grid, Switch, Typography } from '@material-ui/core';
import { Token, getTokenLogoPngSrc } from '../models'

import { CollateralDialog } from '../components'
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { connect } from 'react-redux'

interface ISupplyMarketTableProps {
    tokenInfos?: [],
}

interface ISupplyMarketTableState {
    open: boolean
}

class SupplyMarketTableClass extends React.Component<ISupplyMarketTableProps, ISupplyMarketTableState>  {
    constructor(props: any) {
        super(props);
        this.state = {
            open: false,
        };
        this.collateralSwitchClick.bind(this);
    }

    collateralClose = () => {
        this.setState({ open: false });
    }

    collateralSwitchClick = (event: any) => {
        this.setState({ open: !this.state.open });
    }

    collateralSet = (collateralized: boolean, collateral: Token) => {
        if (collateralized !== collateral.collateral) {
            // TO-DO: Implement collateral action in https://github.com/AskobarNetwork/Askolend/issues/22
        }
        else {
            console.warn(`Collateral for ${collateral.address} is already set to ${collateral.collateral}, no action taken`);
        }
    }

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
                                    <Switch checked={token.value.collateral} onClick={(event) => this.collateralSwitchClick(event)}></Switch>
                                    <CollateralDialog {... {
                                        collateralClose: this.collateralClose,
                                        collateralSet: this.collateralSet,
                                        open: this.state.open,
                                        token: token.value
                                    }}
                                    />
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