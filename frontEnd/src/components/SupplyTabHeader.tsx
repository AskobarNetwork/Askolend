import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardMedia, Container} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar'
import SupplyTabPanel from './SupplyTabPanel'
export default function SupplyTabHeader(props:any) {
    const classes = useStyles();

    return (
    
<>
           <Container className={classes.Header}>
               <Container className={classes.Icon}>
        {props.icon}
               </Container>
           <Typography className={classes.greytext}>To supply or repay {props.asset} to the compound protocol, you need to enable it first </Typography>
</Container>
      <SupplyTabPanel className={classes.TabPanel} asset={props.asset}icon={props.icon} />
      </>
    );
}

const useStyles = makeStyles((theme) => ({
    Header:{
     textAlign:'center',
     justifyContent:'center',
    },
     Icon:{
        align:'center',
        marginTop:50,
        marginBottom:25,
        width:100,
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
       height:100,
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