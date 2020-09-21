import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Switch, Typography } from '@material-ui/core';
import SupplyMarket from './SupplyMarket'
import Collateral from './Collateral'
import TableRow from '@material-ui/core'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
   
  },
}));

export default function SupplyAssetModal(props:any) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  

  const body = (
    <div style={modalStyle} className={classes.paper}>
    
      <SupplyMarket asset ={props.asset} icon={props.icon}/>
    </div>
  );

  return (
    <div>
        <Typography
      onClick={handleOpen}>
      {props.asset} 
</Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}