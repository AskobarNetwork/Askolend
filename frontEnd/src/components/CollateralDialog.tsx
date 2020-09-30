import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    dialog: {
        opacity: 0.5
    },
});


interface ICollateralDialogProps {
    onCollateralClose: Function;
    open: boolean,
    classes?: any,
    tokenInfos?: [],
}

interface ICollateralDialogState {
    open: boolean,
}

class CollateralDialogClass extends React.Component<ICollateralDialogProps, ICollateralDialogState>  {
    constructor(props: ICollateralDialogProps) {
        super(props);
        this.state = {
            open: this.props.open
        };
    }

    render() {
        return (
            <Dialog
                className={this.props.classes.dialog}
                open={this.props.open}
                onClose={() => this.props.onCollateralClose()}
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