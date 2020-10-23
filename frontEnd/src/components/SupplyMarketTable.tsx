import { Avatar, Grid, Switch, Typography } from '@material-ui/core';
import { CollateralDialog, ConfirmationDialog, SupplyDialog } from '../components'
import { Token, getTokenLogoPngSrc, SupplyToken } from '../models'

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
import { getTokenData } from 'actions/askoToken';
import { ERC20Service } from 'services/erc20';

interface ISupplyMarketTableProps {
    moneyMarkets?: [],
    askoTokens?: {},
    refreshMoneyMarket: Function
    
}

interface ISupplyMarketTableState {
    collateralopen: boolean,
    confirmationOpen: boolean,
    confirmationTitle: string,
    selectedToken: SupplyToken | undefined,
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

    collateralSwitchClick = (event: React.MouseEvent, token: SupplyToken) => {
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

    supplyClick = (event: React.MouseEvent, token: SupplyToken) => {
        console.log(token);
        this.props.refreshMoneyMarket(token.token.marketAddress);
        this.setState({
            supplyOpen: !this.state.supplyOpen,
            selectedToken: token
        });
    }

    supplyEnable = async (supplyEnabled: boolean, supply: SupplyToken, confirmationMessage: string) => {
        if (supplyEnabled !== supply.token.supplyEnabled) {
            this.setState({ confirmationOpen: true, confirmationTitle: confirmationMessage });
            // TO-DO: Implement supply action in https://github.com/AskobarNetwork/Askolend/issues/22

            const provider = await ProtocolProvider.getInstance();
            const assetToken = new ERC20Service(provider, supply.token.address);
            await assetToken.approveUnlimited(supply.token.marketAddress);
            
            this.props.refreshMoneyMarket(supply.token.marketAddress);

            this.setState({ confirmationOpen: false, confirmationTitle: confirmationMessage });
        }
        else {
            console.warn(`Supply for ${supply.token.address} is already set to ${supply.token.supplyEnabled}, no action taken`);
        }
    }

    supply = async (tokenToSupply: SupplyToken, amount: number, confirmationMessage: string) => {
        if (tokenToSupply.token.supplyEnabled === true) {
            this.setState({ confirmationOpen: true, confirmationTitle: confirmationMessage });

            const provider = await ProtocolProvider.getInstance();
            const moneyMarket = new MoneyMarketInstanceService(provider, tokenToSupply.token.marketAddress);

            const amountInWei = ProtocolProvider.toWei(amount);

            if (tokenToSupply.lowRisk) {
                await moneyMarket.supplyALRPool(amountInWei);
            } else {
                await moneyMarket.supplyAHRPool(amountInWei);
            }

            this.setState({ confirmationOpen: false, confirmationTitle: confirmationMessage });

            this.props.refreshMoneyMarket(tokenToSupply.token.marketAddress);
        }
        else {
            console.error(`${tokenToSupply.token.address} is not enabled, cannot supply`);
        }
    }

    withdraw = (tokenToSupply: Token, amount: number, confirmationMessage: string) => {
        this.setState({ confirmationOpen: true, confirmationTitle: confirmationMessage });
        // TO-DO: Implement withdraw action in https://github.com/AskobarNetwork/Askolend/issues/23
    }

    supplyClose = () => {
        this.setState({ supplyOpen: false });
    }

    createSupplyTokenList = (markets: string[] | undefined, tokens: any) => {
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

        // ALR OR AHR
        const supply: SupplyToken[] = [];
        for (const token of tokenList) {

            // Need high risk and low risk
            supply.push({
                key: "hr" + token.address,
                title: token.asset + " (High Risk)",
                token,
                balance: token.highRiskBalance,
                wallet: token.walletAmount,
                apy: token.highRiskSupplyAPY,
                lowRisk: false
            })

            supply.push({
                key: "lr" + token.address,
                title: token.asset + " (Low Risk)",
                token,
                balance: token.lowRiskBalance,
                wallet: token.walletAmount,
                apy: token.lowRiskSupplyAPY,
                lowRisk: true
            });
        }

        return supply;
    }

    render() {
        const supplyTokens: SupplyToken[] = this.createSupplyTokenList(this.props.moneyMarkets, this.props.askoTokens);

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
                                <TableCell align='center'>Balance</TableCell>
                                <TableCell align='center'>Collateral</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {supplyTokens.map((token: any) => (
                                <TableRow hover={true} key={token.key} onClick={(event) => {
                                    event.stopPropagation();
                                    this.supplyClick(event, token)
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
                                    <TableCell align='center'>{token.wallet}</TableCell>
                                    <TableCell align='center'>{token.balance}</TableCell>
                                    <TableCell align='center'>
                                        {
                                            token.lowRisk ?
                                            <Switch checked={token.token.collateral} onClick={(event) => {
                                                event.stopPropagation();
                                                this.collateralSwitchClick(event, token);
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

const mapDispatchToProps = (dispatch: any) => {
	return {
		refreshMoneyMarket: (market: string) => {
			dispatch(getTokenData(market));
		}
	}
}

const SupplyMarketTable = connect(mapStateToProps, mapDispatchToProps)(SupplyMarketTableClass)

export { SupplyMarketTable };