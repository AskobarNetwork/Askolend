import { Container, Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardMedia} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar'
import SupplyTabPanel from './SupplyTabPanel'
import BorrowTabPanel from './BorrowTabPanel'
export default function BorrowMarket(props:any) {
    const classes = useStyles();

    return (
        <Card className={classes.SupplyMarket}>
             <AppBar position="static">
             <Container className={classes.AppBar}>
    {props.icon}{props.asset}
        </Container>
</AppBar>

           <Typography className={classes.greytext}>to supply or repay Dai to the compound protocol, you need to enable it first </Typography>

           <CardMedia
        className={classes.media}
        image={'dai.png'}
        title="Dai"
      />
      <BorrowTabPanel />
        </Card>
    );
}

const useStyles = makeStyles((theme) => ({
    Header:{
     
    },
    SupplyMarket: {
        flexGrow: 1,
        height: 600,
        width: 400,
        color:'white',
        border:'1px solid black',
        background:'#f9fafb'
    },
    TabPanel: {
        flexGrow: 1,
        padding: '30px',
        height: 325,
        width: 400,
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