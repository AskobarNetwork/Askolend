import { Grid } from '@material-ui/core';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardHeader , CardMedia} from '@material-ui/core';
import Card from '@material-ui/core/Card';

export default function SupplyMarketBottom() {
    const classes = useStyles();

    return (
        <Card className={classes.SupplyMarket}>
            
           <Typography>test</Typography>
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
        height: 300,
        width: 400,
        background:'black'
    },
    media: {
       height:0
        
      },
}));