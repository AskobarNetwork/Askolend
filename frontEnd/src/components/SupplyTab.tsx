import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardHeader , CardMedia, Button, Container} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SupplyTabPanel from './SupplyTabPanel'
import Divider from '@material-ui/core/Divider';

export function SupplyTab() {
const classes = useStyles();

    return (
        <Card className={classes.SupplyTab}>
        <Typography>Supply Rates </Typography>
        <Container className={classes.container}>
          
         <Typography className={classes.greytext} >Supply APY</Typography>
         <Typography className={classes.blacktext} >3.03%</Typography>

        </Container>
        <hr />
        <Container className={classes.container}>
        <Typography className={classes.greytext} >Distribution APY</Typography>
        <Typography className={classes.blacktext}>6.05%</Typography>

        </Container>
<Button className={classes.Button}>Enable</Button>
<Typography className={classes.greytext}>Wallet Balance</Typography>
        </Card>
    );
}

const useStyles = makeStyles((theme) => ({
    Header:{
     
    },
    SupplyTab: {
        height: 600,
        width: 400,
        color:'black',
        backgroundColor:'white',
        marginTop:0,
    },
    SupplyTabPanel: {
        flexGrow: 1,
        padding: '30px',
        height: 325,
        width: 400,
        background:'white',
        color:'black',
    },
    media: {
       height:0
        
      },
      container:{
          display:'flex',
          verticalAlign:'top',

      },
      greytext:{
          color:'#b2bcc8',
          textAlign:'left',
      },
      blacktext:{
        color:'black',
        fontWeight:1000,
        fontsize:10,
        textAlign:'right',
        marginLeft:'auto',
      },
      Divider:{
        color:'black'
      },
      Button:{
        backgroundColor:'#00d395',
        color:'white',
        width:350,
        height:50,
      },
}));