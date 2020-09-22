import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardMedia, Container} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar'
import SupplyTabPanel from './SupplyTabPanel'
export default function WithdrawTabHeader(props:any) {
    const classes = useStyles();

    return (
    
<>
           <Typography className={classes.greytext}>to supply or repay {props.asset} to the compound protocol, you need to enable it first </Typography>
           <Container>{props.icon}</Container>

      <SupplyTabPanel />
      </>
    );
}

const useStyles = makeStyles((theme) => ({
    Header:{
     
    },
    SupplyMarket: {
        flexGrow: 1,
        height: 800,
        width: 600,
        color:'white',
        border:'1px solid black',
        background:'#f9fafb'
    },
    TabPanel: {
        flexGrow: 1,
        padding: '30px',
        height: 325,
        width: 600,
        background:'white',
        color:'black',
    },
    media: {
        flex:1,
       height:10
        
      },
      AppBar:{
          justifyContent:'center',
          textAlign:'center',
          background:'#f9fafb',
          color:'black',

      },
      greytext:{
        color:'#b2bcc8',
    },
}));