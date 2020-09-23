import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardMedia, Container} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar'
import BorrowTabPanel from './BorrowTabPanel'
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import BorrowForm from './BorrowForm'
export default function BorrowTabHeader(props:any) {
    const classes = useStyles();

    return (
    
<>
<Container className={classes.Header}>
<BorrowForm/>
</Container>
<BorrowTabPanel asset={props.asset}icon={props.icon} />

      </>
    );
}

const useStyles = makeStyles((theme) => ({
    Header:{
     color:'black',
     height:100,

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
        height: 800,
        width: 600,
        color:'white',
        border:'1px solid black',
        background:'#f9fafb'
    },
    Icon:{
        align:'center',
        marginTop:50,
        marginBottom:25,
        width:100,
    },
    TabPanel: {
        flexGrow: 1,
        padding: '30px',
        height: 325,
        width: 600,
        background:'white',
        Color:'#a981ef',
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