import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardHeader , CardMedia} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import SupplyMarketBottom from './SupplyMarketBottom'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from './TabPanel'
export function SupplyMarket() {
    const classes = useStyles();

    return (
        <Card className={classes.SupplyMarket}>
            <TabPanel />

           <Typography>test</Typography>
           <Typography>to supply or repay Dai to the compound protocol, you need to enable it first </Typography>

           <CardMedia
        className={classes.media}
        image={"dai.png"}
        title="Dai"
      />
    
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
        background:'white',
        color:'black',
    },
    TabPanel: {
        flexGrow: 1,
        padding: '30px',
        height: 325,
        width: 400,
        marginTop:275,
        background:'white',
        color:'black',
    },
    media: {
       height:0
        
      },
}));