import { Button, DialogActions, DialogContent, Grid, IconButton, Table, TableBody, TableCell, TableRow, Tooltip, Typography } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { Token } from '../models';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    supplyDialog: {
        opacity: 0.5,
        textAlign: 'center',
    }
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

class SupplyDialogClass extends React.Component<ISupplyDialogProps, {}>  {
    supplySet = (title: string) => {
        this.props.supplyClose();
        this.props.supplySet(!this.props.token?.supplyEnabled, this.props.token, title);
    }

    render() {
        const buttonTooltip =
            this.props.token?.supplyEnabled === false ? `Enable ${this.props.token?.asset} as supply` : `Disable ${this.props.token?.asset}`;
        const enable =
            this.props.token?.supplyEnabled === false ? true : false;
        const message =
            this.props.token?.supplyEnabled === false ? enableSupplyMessage : disableSupplyMessage;
        const title =
            this.props.token?.supplyEnabled === false ? 'Enable' + titlePostfix : 'Disable' + titlePostfix;

        return (
            <Dialog
                className={this.props.classes.supplyDialog}
                open={this.props.supplyOpen}
                onClose={() => this.props.supplyClose()}
                transitionDuration={0}
                onClick={(event) => event.stopPropagation()}
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
                <DialogContent>
                    <Typography variant='subtitle1'>{message}</Typography>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    Borrow Limit
                                </TableCell>
                                <TableCell>
                                    $0 &#x2192; $0
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    Borrow Limit Used
                                </TableCell>
                                <TableCell>
                                    0% &#x2192; 0%
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
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