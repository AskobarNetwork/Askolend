import { Avatar, Grid } from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Authereum from "authereum";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
import Button from '@material-ui/core/Button';
import DcentProvider from "dcent-provider";
import Fortmatic from "fortmatic";
import { IProviderInfo } from 'web3modal';
import { IWeb3ConnectionParameters } from "../model"
// @ts-ignore
import MewConnect from "@myetherwallet/mewconnect-web-client";
import Portis from "@portis/web3";
import React from 'react';
// @ts-ignore
import Squarelink from "squarelink";
import Toolbar from '@material-ui/core/Toolbar';
import Torus from "@toruslabs/torus-embed";
import Typography from '@material-ui/core/Typography';
import UniLogin from "@unilogin/provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { connect } from "react-redux"
import { makeWeb3Connection } from "../actions"
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

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            infuraId: "INFURA_ID" // TO-DO: Add support
        }
    },
    fortmatic: {
        package: Fortmatic,
        options: {
            key: "FORTMATIC_KEY" // TO-DO: Add support
        }
    },
    torus: {
        package: Torus, // required
        options: {             // TO-DO: Add support
            // Note: A Torus instance is available on the provider as provider.torus
            /*
            networkParams: {
                host: "https://localhost:8545", // optional
                chainId: 1337, // optional
                networkId: 1337 // optional
            },
            config: {
                buildEnv: "development" // optional
            }
            */
        }
    },
    authereum: {
        package: Authereum
    },
    unilogin: {
        package: UniLogin
    },
    burnerconnect: {
        package: BurnerConnectProvider,
        options: {
            defaultNetwork: "100" // TO-DO: Add support
        }
    },
    portis: {
        package: Portis,
        options: {
            id: "PORTIS_ID" // TO-DO: Add support
        }
    },
    squarelink: {
        package: Squarelink,
        options: {
            id: "SQUARELINK_ID" // TO-DO: Add support
        }
    },
    mewconnect: {
        package: MewConnect,
        options: {
            infuraId: "INFURA_ID" // TO-DO: Add support
        }
    },
    dcentwallet: {
        package: DcentProvider,
        options: {
            rpcUrl: "INSERT_RPC_URL" // TO-DO: Add support
        }
    }
};

interface IBarProps {
    classes: any,
    makeWeb3Connection: Function,
    connected: boolean,
    web3Modal: Web3Modal,
    provider: IProviderInfo,
    web3: Web3,
}

interface IBarState {
    account: String,
    balance: String
}

class BarClass extends React.Component<IBarProps, IBarState>  {
    constructor(props: any) {
        super(props);
        this.state = {
            account: this.props?.web3?.givenProvider?.selectedAddress || "",
            balance: "0"
        };
    }


    componentDidUpdate = () => {
        var account = this.props.web3.givenProvider.selectedAddress;
        if (this.state.account !== account) {
            this.setState({
                account: account,
            });
        }

        this.props.web3.eth?.getBalance(account).then((balance) => {
            if (this.state.balance !== balance && balance !== undefined) {
                this.setState({
                    balance: balance,
                });
            }
        })

    }

    truncate = (str: String, n: number) => {
        return (str.length > n) ? str.substr(0, n) + '...' : str;
    };

    render() {
        var params: IWeb3ConnectionParameters = {
            network: "mainnet",
            disableInjectedProvider: false,
            cacheProvider: true,
            providerOptions: providerOptions,
        }

        const button = this.props.connected === true ?
            <React.Fragment>
                <Button color="secondary" variant="contained">
                    {this.state.balance} &nbsp; <Avatar src={"favicon32x32.png"} alt="" className={this.props.classes.small} />
                </Button>
                &nbsp;
                <Button color="secondary" variant="contained">
                    {this.truncate(this.state.account, 10)}
                </Button>
            </React.Fragment>
            : <Button color="secondary" variant="contained" onClick={() =>
                this.props.makeWeb3Connection(params)}>
                Connect Wallet
        </Button>;

        return (
            <div className={this.props.classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Grid
                            alignItems="center"
                            container
                            direction="row"
                            justify="space-between"
                        >
                            <Grid>
                                <Typography variant="h4" className={this.props.classes.title} noWrap display={"block"}>
                                    <img src={"favicon32x32.png"} alt="" /> Askolend
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
        makeWeb3Connection: (web3ConnectionParameters: IWeb3ConnectionParameters) => {
            dispatch(makeWeb3Connection(web3ConnectionParameters))
        }
    }
}

const UnconnectedBar: any = withStyles(styles)(BarClass);
const Bar = connect(mapStateToProps, mapDispatchToProps)(UnconnectedBar)

export { Bar };