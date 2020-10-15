import { Button, DialogActions, DialogContent, Grid, IconButton, Tab, Table, TableBody, TableCell, TableRow, Tooltip, Typography } from '@material-ui/core';

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
    backdrop: {
        opacity: 0.5
    },
    supplyDialog: {
        textAlign: 'center',
    },
});

const disableSupplyMessage =
    'This asset will no longer be used towards your borrowing limit, and can\'t be seized in liquidation'
const enableSupplyMessage =
    'Each asset used as supply increases your borrowing limit. Be careful, this can subject the asset to being seized in liquidation.';
const titlePostfix = ' as Supply';

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
        const buttonTooltip =
            this.props.token?.supplyEnabled === false ? `Enable ${this.props.token?.asset} as supply` : `Disable ${this.props.token?.asset}`;
        const enable =
            this.props.token?.supplyEnabled === false ? true : false;
        const message =
            this.props.token?.supplyEnabled === false ? enableSupplyMessage : disableSupplyMessage;
        const title =
            this.props.token?.supplyEnabled === false ? 'Enable' + titlePostfix : 'Disable' + titlePostfix;
        const value = this.state.value

        return (
            <Dialog
                className={this.props.classes.supplyDialog}
                open={this.props.supplyOpen}
                onClose={() => this.props.supplyClose()}
                transitionDuration={0}
                onClick={(event) => event.stopPropagation()}
                BackdropProps={{
                    invisible: true
                }}
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
                    {title}
                </DialogTitle>
                <DialogContent className={this.props.classes.tabs}>
                    <Typography variant='subtitle1'>{message}</Typography>
                    <TabContext value={value}>
                        <TabList onChange={this.handleChange}>
                            <Tab label="Item One" value="1" />
                            <Tab label="Item Two" value="2" />
                            <Tab label="Item Three" value="3" />
                        </TabList>
                        <TabPanel hidden value="1">Item One</TabPanel>
                        <TabPanel hidden value="2">Item Two</TabPanel>
                        <TabPanel hidden value="3">Item Three</TabPanel>
                    </TabContext>
                </DialogContent>
                <DialogActions>
                    <Grid container item xs={12}>
                        <Tooltip title={buttonTooltip}>
                            <Button color='secondary'
                                fullWidth={true}
                                variant='contained'
                                onClick={() => this.supplySet(title)}>
                                {enable === true ? 'Enable' : 'Disable'}
                            </Button>
                        </Tooltip>
                    </Grid>
                </DialogActions>
            </Dialog>
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