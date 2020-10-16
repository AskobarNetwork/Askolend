import {
    Avatar,
    Button,
    DialogActions,
    DialogContent,
    Grid,
    IconButton,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { Token } from '../models';
import { connect } from 'react-redux'
import { getTokenLogoPngSrc } from '../models'
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    supplyDialog: {
        textAlign: 'center',
    }
});

interface ISupplyDialogProps {
    supply: Function,
    supplyClose: Function,
    supplyEnable: Function,
    supplyOpen: boolean,
    token: Token | undefined,
    withdraw: Function
    classes?: any,
}

interface ISupplyDialogState {
    amount: number,
    supply: boolean,
    value: string,
}

class SupplyDialogClass extends React.Component<ISupplyDialogProps, ISupplyDialogState>  {
    constructor(props: any) {
        super(props);
        this.state = {
            amount: 0,
            supply: true,
            value: '1'
        };
        this.handleChange.bind(this);
    }

    supplyEnable = (title: string) => {
        this.props.supplyClose();
        this.props.supplyEnable(!this.props.token?.supplyEnabled, this.props.token, title);
    }

    supply = (title: string) => {
        this.props.supplyClose();
        this.props.supply(this.props.token, 0, title);
    }

    withdraw = (title: string) => {
        this.props.supplyClose();
        this.props.withdraw(this.props.token, 0, title);
    }

    handleChange = (event: any, newValue: any) => {
        this.setState({ supply: !this.state.supply, value: newValue });
    };

    render() {
        const Message = (this.props.token?.supplyEnabled === false && this.state.supply === true) ?
            <Typography variant='subtitle1'>To supply or repay {this.props.token?.asset} you must enable it first.</Typography> :
            <TextField
                type="number"
            />;

        return (
            <Dialog
                className={this.props.classes.supplyDialog}
                open={this.props.supplyOpen}
                onClose={() => this.props.supplyClose()}
                transitionDuration={0}
                onClick={(event) => event.stopPropagation()}
                hideBackdrop={true}
                fullWidth={true}
            >
                <DialogTitle>
                    <Grid
                        container
                        justify='flex-end'
                    >
                        <IconButton onClick={() => this.props.supplyClose()}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        justify="center"
                        alignItems="center"
                    >
                        <Avatar src={getTokenLogoPngSrc(this.props.token?.address || '')} alt={this.props.token?.asset} /> &nbsp;
                        <Typography>{this.props.token?.asset}</Typography>
                    </Grid>
                </DialogTitle>
                <DialogContent className={this.props.classes.tabs}>
                    <Grid
                        container
                        direction="column"
                    >
                        {Message}
                        <TabContext value={this.state.value}>
                            <TabList onChange={this.handleChange} variant='fullWidth'>
                                <Tab label="Supply" value="1" />
                                <Tab label="Withdraw" value="2" />
                            </TabList>
                            <TabPanel value="1">
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Supply APY
                                            </TableCell>
                                            <TableCell>
                                                {this.props.token?.supplyApy}%
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Distribution APY
                                            </TableCell>
                                            <TableCell>
                                                -%
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TabPanel>
                            <TabPanel value="2">
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Supply APY
                                            </TableCell>
                                            <TableCell>
                                                {this.props.token?.supplyApy}%
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Distribution APY
                                            </TableCell>
                                            <TableCell>
                                                -%
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Borrow Limit
                                        </TableCell>
                                            <TableCell>
                                                ${this.props.token?.borrowLimit} &#x2192; $0
                                        </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Borrow Limit Used
                                        </TableCell>
                                            <TableCell>
                                                {this.props.token?.borrowLimitUsed}% &#x2192; 0%
                                        </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TabPanel>
                        </TabContext>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid
                        container
                        direction="column"
                    >
                        <Grid container item xs={12}>
                            <Button
                                color='secondary'
                                fullWidth={true}
                                variant='contained'
                                onClick={() =>
                                    this.state.supply === true ?
                                        (this.props.token?.supplyEnabled === false ?
                                            this.supplyEnable(`Enable ${this.props.token?.asset} as Supply`) :
                                            this.supply(`Supply ${this.props.token?.asset}`)
                                        ) :
                                        this.withdraw(`Withdraw ${this.props.token?.asset}`)
                                }>
                                {this.state.supply === true ?
                                    (this.props.token?.supplyEnabled === false ?
                                        'Enable' :
                                        'Supply'
                                    ) :
                                    'Withdraw'
                                }
                            </Button>
                        </Grid>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="space-between"
                                        alignItems="center"
                                    >
                                        <TableCell>
                                            {this.state.supply === true ? 'Wallet Balance' : 'Protocol Balance'}
                                        </TableCell>
                                        <TableCell>
                                            0 {this.props.token?.asset}
                                        </TableCell>
                                    </Grid>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                </DialogActions >
            </Dialog >
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        tokenInfos: state.tokenInfo.tokenInfos,
    }
}

// @ts-ignore
const UnconnectedSupplyDialogClass: any = withStyles(styles)(SupplyDialogClass);
const SupplyDialog = connect(mapStateToProps, null)(UnconnectedSupplyDialogClass)

export { SupplyDialog };