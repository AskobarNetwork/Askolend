import { Avatar, Grid, Switch, Typography } from '@material-ui/core';
import { CollateralDialog, ConfirmationDialog, SupplyDialog } from '../components'
import { Token, getTokenLogoPngSrc, createToken } from '../models'

import Paper from '@material-ui/core/Paper';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { connect } from 'react-redux'

import memoize from "memoize-one";
import { ProtocolProvider } from 'web3';
import { MoneyMarketInstanceService } from 'services/MoneyMarketInstance';

interface ISupplyMarketTableProps {
    moneyMarkets?: [],
    askoTokens?: {},
}

interface ISupplyMarketTableState {
    collateralopen: boolean,
    confirmationOpen: boolean,
    confirmationTitle: string,
    selectedToken: Token | undefined,
    supplyOpen: boolean,
}

class SupplyMarketTableClass extends React.Component<ISupplyMarketTableProps, ISupplyMarketTableState>  {
    constructor(props: any) {
        super(props);
        this.state = {
            collateralopen: false,
            confirmationOpen: false,
            confirmationTitle: '',
            selectedToken: undefined,
            supplyOpen: false
        };
        this.collateralSwitchClick.bind(this);
    }

    collateralClose = () => {
        this.setState({ collateralopen: false });
    }

    collateralSwitchClick = (event: React.MouseEvent, token: Token) => {
        this.setState({
            collateralopen: !this.state.collateralopen,
            selectedToken: token,
        });
    }

    collateralSet = (collateralized: boolean, collateral: Token, confirmationMessage: string) => {
        if (collateralized !== collateral.collateral) {
            this.setState({ confirmationOpen: true, confirmationTitle: confirmationMessage });
            // TO-DO: Implement collateral action in https://github.com/AskobarNetwork/Askolend/issues/22
        }
        else {
            console.warn(`Collateral for ${collateral.address} is already set to ${collateral.collateral}, no action taken`);
        }
    }

    confirmationClose = () => {
        this.setState({ confirmationOpen: false });
    }

    supplyClick = (event: React.MouseEvent, token: Token) => {
        this.setState({
            supplyOpen: !this.state.supplyOpen,
            selectedToken: token
        });
    }

    supplyEnable = (supplyEnabled: boolean, supply: Token, confirmationMessage: string) => {
        if (supplyEnabled !== supply.supplyEnabled) {
            this.setState({ confirmationOpen: true, confirmationTitle: confirmationMessage });
            // TO-DO: Implement supply action in https://github.com/AskobarNetwork/Askolend/issues/22
        }
        else {
            console.warn(`Supply for ${supply.address} is already set to ${supply.supplyEnabled}, no action taken`);
        }
    }

    supply = (tokenToSupply: Token, amount: number, confirmationMessage: string) => {
        if (tokenToSupply.supplyEnabled === true) {
            this.setState({ confirmationOpen: true, confirmationTitle: confirmationMessage });
            // TO-DO: Implement supply action in https://github.com/AskobarNetwork/Askolend/issues/22
        }
        else {
            console.error(`${tokenToSupply.address} is not enabled, cannot supply`);
        }
    }

    withdraw = (tokenToSupply: Token, amount: number, confirmationMessage: string) => {
        this.setState({ confirmationOpen: true, confirmationTitle: confirmationMessage });
        // TO-DO: Implement withdraw action in https://github.com/AskobarNetwork/Askolend/issues/23
    }

    supplyClose = () => {
        this.setState({ supplyOpen: false });
    }

    createSupplyTokenList = memoize(
        (markets: string[] | undefined, tokens: any) => {
            if (tokens === undefined || markets === undefined) {
                return [];
            }

            const tokenList: Token[] = [];
            for (const market of markets) {
                const token = tokens[market];
                if (token !== undefined) {
                    tokenList.push(token);
                }
            }

            const supply: any[] = [];
            for (const token of tokenList) {

                // Need high risk and low risk
                supply.push({
                    key: "hr" + token.address,
                    title: token.asset + " (High Risk)",
                    token,
                    apy: token.highRiskSupplyAPY,
                    allowCollateral: false
                })

                supply.push({
                    key: "lr" + token.address,
                    title: token.asset + " (Low Risk)",
                    token,
                    apy: token.lowRiskSupplyAPY,
                    allowCollateral: true
                });
            }

            return supply;
        }
    )

    render() {
        const supplyTokens = this.createSupplyTokenList(this.props.moneyMarkets, this.props.askoTokens);
        console.log(supplyTokens);

        return (
            <React.Fragment>
                <ConfirmationDialog {...{
                    confirmationClose: this.confirmationClose,
                    confirmationOpen: this.state.confirmationOpen,
                    title: this.state.confirmationTitle
                }}
                />
                <CollateralDialog {... {
                    collateralClose: this.collateralClose,
                    collateralSet: this.collateralSet,
                    collateralOpen: this.state.collateralopen,
                    token: this.state.selectedToken
                }}
                />
                <SupplyDialog {... {
                    supply: this.supply,
                    supplyClose: this.supplyClose,
                    supplyEnable: this.supplyEnable,
                    supplyOpen: this.state.supplyOpen,
                    token: this.state.selectedToken,
                    withdraw: this.withdraw,
                }}
                />
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
                            {supplyTokens.map((token: any) => (
                                <TableRow hover={true} key={token.key} onClick={(event) => {
                                    event.stopPropagation();
                                    this.supplyClick(event, token.token)
                                }}>
                                    <TableCell align='left'>
                                        <Grid
                                            container
                                            direction='row'
                                            justify='flex-start'
                                            alignItems='center'
                                        >
                                            <Avatar src={getTokenLogoPngSrc(token.token.address)} alt={token.token.asset} /> &nbsp;
                                            <Typography>{token.title}</Typography>
                                        </Grid>
                                    </TableCell>
                                    <TableCell align='right'>{token.apy + '%'}</TableCell>
                                    <TableCell align='center'>{0}</TableCell>
                                    <TableCell align='center'>
                                        {
                                            token.allowCollateral ?
                                            <Switch checked={token.token.collateral} onClick={(event) => {
                                                event.stopPropagation();
                                                this.collateralSwitchClick(event, token.token);
                                            }}></Switch> : null
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </React.Fragment >
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        moneyMarkets: state.moneyMarket.instances,
        askoTokens: state.askoToken.tokens
    }
}

const SupplyMarketTable = connect(mapStateToProps, null)(SupplyMarketTableClass)

export { SupplyMarketTable };