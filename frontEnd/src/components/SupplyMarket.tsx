import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Container, CardMedia} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar'
import SupplyTabPanel from './SupplyTabPanel'
import SupplyTabHeader from './SupplyTabHeader'
export default function SupplyMarket(props:any) {
    const classes = useStyles();

    return (
        <Card className={classes.SupplyMarket}>
           
    <Container className={classes.AppBar}>
    {props.icon}{props.asset}
        </Container>


           <SupplyTabHeader asset={props.asset} icon={props.icon}/>
      <SupplyTabPanel asset ={props.asset} icon={props.icon}/>
        </Card>
    );
}

const useStyles = makeStyles((theme) => ({
    Header:{
     justifyContent:'center'
    },
    Icon:{
        marginLeft:'auto',
    },
    SupplyMarket: {
        flexGrow: 1,
        height: 600,
        width: 400,
        color:'white',
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
          height:50,
          fontSize:25,
          display:'flex',
          borderBottom:'solid 1px grey',
          position:'static',
      },
      greytext:{
        color:'#b2bcc8',
    },
}));