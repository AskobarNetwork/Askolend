import { Button, DialogActions, DialogContent, Grid, IconButton, Table, TableBody, TableCell, TableRow, Tooltip, Typography } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { Token } from '../models';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    collateralDialog: {
        textAlign: 'center',
    }
});

const disableCollateralMessage =
    'This asset will no longer be used towards your borrowing limit, and can\'t be seized in liquidation'
const enableCollateralMessage =
    'Each asset used as collateral increases your borrowing limit. Be careful, this can subject the asset to being seized in liquidation.';
const titlePostfix = ' as Collateral';

interface ICollateralDialogProps {
    collateralClose: Function,
    collateralSet: Function,
    collateralOpen: boolean,
    token: Token | undefined,
    classes?: any,
}

class CollateralDialogClass extends React.Component<ICollateralDialogProps, {}>  {
    collateralSet = (title: string) => {
        this.props.collateralClose();
        this.props.collateralSet(!this.props.token?.collateral, this.props.token, title);
    }

    render() {
        const buttonTooltip =
            this.props.token?.collateral === false ? `Enable ${this.props.token?.asset} as collateral` : `Disable ${this.props.token?.asset}`;
        const enable =
            this.props.token?.collateral === false ? true : false;
        const message =
            this.props.token?.collateral === false ? enableCollateralMessage : disableCollateralMessage;
        const title =
            this.props.token?.collateral === false ? 'Enable' + titlePostfix : 'Disable' + titlePostfix;

        return (
            <Dialog
                className={this.props.classes.collateralDialog}
                open={this.props.collateralOpen}
                onClose={() => this.props.collateralClose()}
                transitionDuration={0}
                onClick={(event) => event.stopPropagation()}
                hideBackdrop={true}
            >
                <DialogTitle>
                    <Grid
                        container
                        justify='flex-end'
                    >
                        <IconButton onClick={() => this.props.collateralClose()}
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
                </DialogContent>
                <DialogActions>
                    <Grid container item xs={12}>
                        <Tooltip title={buttonTooltip}>
                            <Button color='secondary'
                                fullWidth={true}
                                variant='contained'
                                onClick={() => this.collateralSet(title)}>
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
const UnconnectedCollateralDialogClass: any = withStyles(styles)(CollateralDialogClass);
const CollateralDialog = connect(mapStateToProps, null)(UnconnectedCollateralDialogClass)

export { CollateralDialog };