import { CircularProgress, DialogContent, Grid, IconButton, Typography } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    confirmationDialog: {
        textAlign: 'center',
    }
});

interface IConfirmationDialogProps {
    confirmationClose: Function,
    confirmationOpen: boolean,
    title: string,
    classes?: any,
}

class ConfirmationDialogClass extends React.Component<IConfirmationDialogProps, {}>  {
    render() {
        return (
            <Dialog
                className={this.props.classes.confirmationDialog}
                open={this.props.confirmationOpen}
                onClose={() => this.props.confirmationClose()}
                transitionDuration={0}
                BackdropProps={{
                    invisible: true
                }}
            >
                <DialogTitle>
                    <Grid
                        container
                        justify='flex-end'
                    >
                        <IconButton onClick={() => this.props.confirmationClose()}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    {this.props.title}
                </DialogTitle>
                <DialogContent>
                    <CircularProgress color='secondary' />
                    <Typography variant='subtitle1'>Confirm the transaction</Typography>
                </DialogContent>
            </Dialog>
        );
    }
}

// @ts-ignore
const ConfirmationDialog: any = withStyles(styles)(ConfirmationDialogClass);

export { ConfirmationDialog };