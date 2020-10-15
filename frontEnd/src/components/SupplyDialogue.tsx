import {
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
    Typography,
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
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    supplyDialog: {
        textAlign: 'center',
    }
});

interface ISupplyDialogProps {
    supplyClose: Function,
    supplySet: Function,
    supplyOpen: boolean,
    token: Token | undefined,
    classes?: any,
}

interface ISupplyDialogState {
    value: string,
}

class SupplyDialogClass extends React.Component<ISupplyDialogProps, ISupplyDialogState>  {
    constructor(props: any) {
        super(props);
        this.state = {
            value: '1'
        };
    }

    supplySet = (title: string) => {
        this.props.supplyClose();
        this.props.supplySet(!this.props.token?.supplyEnabled, this.props.token, title);
    }

    handleChange = (event: any, newValue: any) => {
        this.setState({ value: newValue });
    };

    render() {
        const Message = this.props.token?.supplyEnabled === false ?
            <Typography variant='subtitle1'>To supply or repay {this.props.token?.asset} you must enable it first.</Typography>
            : null;

        return (
            <Dialog
                className={this.props.classes.supplyDialog}
                open={this.props.supplyOpen}
                onClose={() => this.props.supplyClose()}
                transitionDuration={0}
                onClick={(event) => event.stopPropagation()}
                hideBackdrop={true}
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
                    {this.props.token?.asset}
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
                                Withdraw
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
                            <Button color='secondary'
                                fullWidth={true}
                                variant='contained'
                                onClick={() => this.supplySet(`Enable ${this.props.token?.asset} as Supply`)}>
                                Enable
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
                                            Wallet Balance
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