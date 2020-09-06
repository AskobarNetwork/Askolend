import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardHeader , CardMedia, Button} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel'

export function SupplyTab() {
const classes = useStyles();

    return (
        <Card className={classes.SupplyMarket}>
        <Typography>Supply Rates </Typography>
        <Typography>Supply APY</Typography>
        <Typography>Distribution APY</Typography>
<Button>Enable</Button>
<Typography>Wallet Balance</Typography>
        </Card>
    );
}

const useStyles = makeStyles((theme) => ({
    Header:{
     
    },
    SupplyMarket: {
        flexGrow: 1,
        padding: '30px',
        height: 600,
        width: 400,
        color:'white',
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
       height:0
        
      },
}));