import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    backdrop: {
        backgroundColor: "transparent"
    },

    paperBackdrop: {
        backgroundColor: "transparent",
        boxShadow: "none",
        overflow: "hidden"
    },
});


interface ICollateralDialogProps {
    open?: boolean,
    classes?: any,
    tokenInfos?: [],
}

interface ICollateralDialogState {

}

class CollateralDialogClass extends React.Component<ICollateralDialogProps, ICollateralDialogState>  {

    render() {
        return (
            <Dialog open={this.props.open || false}
                BackdropProps={{
                    classes: {
                        root: this.props.classes.backdrop
                    }
                }
                }
                PaperProps={{
                    classes: {
                        root: this.props.classes.paperBackdrop
                    }
                }}
            >
                <DialogTitle>Collateral</DialogTitle>
            </Dialog>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        tokenInfos: state.tokenInfo.tokenInfos,
    }
}

const UnconnectedCollateralDialogClass: any = withStyles(styles)(CollateralDialogClass);
const CollateralDialog = connect(mapStateToProps, null)(UnconnectedCollateralDialogClass)

export { CollateralDialog };