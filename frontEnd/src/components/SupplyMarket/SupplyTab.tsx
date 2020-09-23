import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardHeader , CardMedia, Button, Container, Avatar} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SupplyTabPanel from './SupplyTabPanel'
import Divider from '@material-ui/core/Divider';

export function SupplyTab(props:any) {
const classes = useStyles();

    return (
        <Card className={classes.SupplyTab}>
        <Typography className={classes.blacktext}>Supply Rates</Typography>
        <Container className={classes.SupplyApy}>{props.icon}
    <Typography className={classes.greytext} >Supply APY</Typography>
         <Typography align='right'className={classes.blacktext} >3.03%</Typography>

        </Container>
        <hr />
        <Container className={classes.container}>
        <Avatar src={"dai.png"} alt="" />
        <Typography className={classes.greytext} >Distribution APY</Typography>
        <Typography align='right'className={classes.blacktext}>6.05%</Typography>

        </Container>
        <Container className={classes.container}>
    <Typography className={classes.greytext} >Wallet Balance</Typography>
    <Typography align='right' className={classes.blacktext} >0 {props.asset}</Typography>

        </Container>
<Button className={classes.Button}>Enable</Button>
        </Card>
    );
}

const useStyles = makeStyles((theme) => ({
    Header:{
     
    },
    SupplyTab: {
        height: 600,
        color:'black',
        backgroundColor:'white',
        marginTop:0,
    },
  
    SupplyTabPanel: {
        flexGrow: 1,
        height: 325,
        background:'white',
        color:'black',
    },
    SupplyApy: {
        display:'flex',
        verticalAlign:'top',
        width:375,
        marginRight:'auto',
        align:'left',
        
      },
      container:{
          display:'flex',
          verticalAlign:'top',

      },
      greytext:{
          color:'#b2bcc8',
          textAlign:'left',
          padding:10,
      },
      blacktext:{
        color:'black',
        fontWeight:1000,
        fontsize:10,
        marginLeft:'auto',
        padding:10,
      },
      Divider:{
        color:'black'
      },
      Button:{
        backgroundColor:'#00d395',
        color:'white',
        width:'100%',

        height:50,
      },
}));