import { Container, Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardMedia} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar'
import BorrowTabPanel from './BorrowTabPanel'
import BorrowTabHeader from './BorrowTabHeader'
import RepayTabHeader from './RepayTabHeader'
import BorrowForm from './BorrowForm'
export default function BorrowMarket(props:any) {
    const classes = useStyles();

    return (
        <Card className={classes.SupplyMarket}>
           
        <Container className={classes.AppBar}>
        {props.icon}{props.asset}
            </Container>
    
    
               <BorrowTabHeader className={classes.Text} asset={props.asset}icon={props.icon}/>
          <BorrowTabPanel asset ={props.asset} icon={props.icon}/>
            </Card>
    );
}

const useStyles = makeStyles((theme) => ({
    Header:{
     justifyContent:'center',
     width:375,
    },
    
    Icon:{
        marginLeft:'auto',
    },
    Text:{
        marginTop:25,
        color:'black',
        fontSize:50,
        width:325,
        textAlign:'center',
        borderBottom:'none',
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