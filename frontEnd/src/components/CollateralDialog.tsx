import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { Token } from '../models';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/styles';

const styles = (theme: any) => ({
    dialog: {
        opacity: 0.5
    },
});

const disableCollateralMessage = 
    'This asset will no longer be used towards your borrowing limit, and can\'t be seized in liquidation'
const enableCollateralMessage =
    'Each asset used as collateral increases your borrowing limit. Be careful, this can subject the asset to being seized in liquidation.';
const titlePostfix = ' as Collateral';

interface ICollateralDialogProps {
    collateralClose: Function,
    collateralSet: Function,
    open: boolean,
    token: Token,
    classes?: any,
}

interface ICollateralDialogState {
    enable: boolean,
    message: string,
    open: boolean,
    title: string,
}

class CollateralDialogClass extends React.Component<ICollateralDialogProps, ICollateralDialogState>  {
    constructor(props: ICollateralDialogProps) {
        super(props);
        this.state = {
            enable: this.props.token.collateral === false? true: false,
            message: this.props.token.collateral === false? enableCollateralMessage: disableCollateralMessage,
            open: this.props.open,
            title: this.props.token.collateral === false? 'Enable' + titlePostfix: 'Disable' + titlePostfix,
        };
    }
    
    collateralSet = () => {
        this.props.collateralSet(!this.props.token.collateral, this.props.token);
    }
    
    render() {
        return (
            <Dialog
                className={this.props.classes.dialog}
                open={this.props.open}
                onClose={() => this.props.collateralClose()}
            >
                <DialogTitle>{this.state.title}</DialogTitle>
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