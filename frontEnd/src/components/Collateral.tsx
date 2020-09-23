import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { CardHeader , CardMedia, Button, Container, Link} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';

export default function Collateral(props:any) {
const classes = useStyles();

    return (
        <Card className={classes.Collateral}>
        <Typography className={classes.blacktext} align={'center'}>Enable as Collateral</Typography>
        <Typography className={classes.Header} align={'center'} >Each asset used as collateral increases your borrowing limit
        Be careful, this can subject the asset to being seized in liquidation. <Link>Learn more</Link></Typography>

        <Container className={classes.container}>
          
         <Typography className={classes.greytext} align='left'>Borrow Limit</Typography>
         <Container className={classes.arrow}>
         <Typography align='right'className={classes.blacktext}>$0.00</Typography>
         <ArrowForwardIcon />
         <Typography align='right'className={classes.blacktext}>$0</Typography>
         </Container>

        </Container>
        <hr />
        <Container className={classes.Holder}>
        <Typography className={classes.greytext} align={'left'}>Borrow Limit Used</Typography>
         <Container className={classes.arrow}>
         <Typography className={classes.blacktext}>$0.00</Typography>
         <ArrowForwardIcon />
         <Typography className={classes.blacktext}>$0</Typography>
         </Container>
         </Container>
    <Button className={classes.Button}>Use {props.asset} as collateral</Button>
         <Container className={classes.container}>

<Typography className={classes.greytext}>Wallet Balance</Typography>
    <Typography className={classes.WalletBal} align='right'>{props.asset}</Typography>
</Container>
        </Card>
    );
}

const useStyles = makeStyles((theme) => ({
    Header:{
      color:'#b2bcc8',
      marginBottom:50,
    },
    Collateral: {
        height: 400,
        width: 400,
        color:'black',
        backgroundColor:'white',
        marginTop:0,
    },
   
    media: {
       height:0
        
      },
      container:{
          display:'flex',
          verticalAlign:'top',
        
      },
      TextLine:{
        
      },
      greytext:{
          color:'#b2bcc8',
          
          
      },
      WalletBal:{
        color:'black',
        fontWeight:1000,
        fontsize:10,
        textAlign:'right',
        marginLeft:'auto',
      },
      blacktext:{
        color:'black',
        fontWeight:1000,
        fontsize:10,
      
      },
      arrow:{
          justifyContent:'right',
        color:'#b2bcc8',
        display:'flex',
        verticalAlign:'top',
        textAlign:'right',
        marginLeft:'auto',
        width:50,
      },
      Divider:{
        color:'black'
      },
      Holder:{
        marginBottom:50,
        display:'flex',
        verticalAlign:'top',
      },
      Button:{
        backgroundColor:'#a981ef',
        color:'white',
        width:'90%',
        height:50,
        textAlign:'center',
        marginLeft:25,
      },
}));