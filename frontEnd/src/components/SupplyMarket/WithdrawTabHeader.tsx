import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardMedia, Container} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar'
import SupplyTabPanel from './SupplyTabPanel'
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

export default function WithdrawTabHeader(props:any) {
    const classes = useStyles();

    return (
    
<>
<Container className={classes.Header}>
<Input className={classes.Text} placeholder='0'/>

</Container>
      <SupplyTabPanel className={classes.TabPanel} asset={props.asset}icon={props.icon} />

      <SupplyTabPanel />
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