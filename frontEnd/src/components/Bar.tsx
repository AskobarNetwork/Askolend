import { Avatar, Grid } from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Web3 from 'web3';
import { connect } from 'react-redux'
import { makeWeb3Connection } from '../actions'
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    small: {
        maxWidth: '15px',
        maxHeight: '15px',
    },
});

interface IBarProps {
    classes: any,
    makeWeb3Connection: Function,
    connected: boolean,
    web3: Web3,
}

interface IBarState {
    account: String | undefined,
    balance: String
}

class BarClass extends React.Component<IBarProps, IBarState>  {
    constructor(props: IBarProps) {
        super(props);
        this.state = {
            account: this.props?.web3?.givenProvider?.selectedAddress || undefined,
            balance: '0'
        };
    }


    componentDidUpdate = () => {
        try {
            var account = this.props.web3.givenProvider.selectedAddress;
            if (this.state.account !== account) {
                this.setState({
                    account: account,
                });
            }

            if (account !== undefined) {
                this.props.web3.eth.getBalance(account).then((balance) => {
                    if (this.state.balance !== balance && balance !== undefined) {
                        this.setState({
                            balance: balance,
                        });
                    }
                })
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    truncate = (str: String, n: number) => {
        return (str.length > n) ? str.substr(0, n) + '...' : str;
    };

    render() {
        const button = this.props.connected === true && this.state.account !== undefined ?
            <React.Fragment>
                <Button color='secondary' variant='contained'>
                    {this.state.balance} &nbsp; <Avatar src={'favicon32x32.png'} alt='' className={this.props.classes.small} />
                </Button>
                &nbsp;
                <Button color='secondary' variant='contained'>
                    {this.truncate(this.state.account, 10)}
                </Button>
            </React.Fragment>
            : <Button color='secondary' variant='contained' onClick={() =>
                this.props.makeWeb3Connection(process.env.REACT_APP_FORTMATIC_API_KEY || '')}>
                Connect Wallet
        </Button>;

        return (
            <div className={this.props.classes.root}>
                <AppBar position='static'>
                    <Toolbar>
                        <Grid
                            alignItems='center'
                            container
                            direction='row'
                            justify='space-between'
                        >
                            <Grid>
                                <Typography variant='h4' className={this.props.classes.title} noWrap display={'block'}>
                                    <img src={'favicon32x32.png'} alt='' /> Askolend
                                </Typography>
                            </Grid>
                            <Grid>
                                {button}
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}



const mapStateToProps = (state: any) => {
    return {
        connected: state.web3Connector.connected,
        web3Modal: state.web3Connector.web3Modal,
        provider: state.web3Connector.provider,
        web3: state.web3Connector.web3
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        makeWeb3Connection: (fortmaticApiKey: string) => {
            dispatch(makeWeb3Connection(fortmaticApiKey))
        }
    }
}

const UnconnectedBar: any = withStyles(styles)(BarClass);
const Bar = connect(mapStateToProps, mapDispatchToProps)(UnconnectedBar)

export { Bar };