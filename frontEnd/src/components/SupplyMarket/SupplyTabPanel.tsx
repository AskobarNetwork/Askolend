import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {SupplyTab} from './SupplyTab'
import {WithdrawTab} from './WithdrawTab'
function SupplyTabPanel(props:any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

SupplyTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index:any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
    Tab:{
        backgroud:'#f9fafb'
        
    },
    AppBar:{
        backgroundColor:'#f9fafb',
        color:'	#00d395'
    },
  root: {
    color:'white',
    backgroundColor:'#f9fafb'

  },
}));

export default function SimpleTabs(props:any) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event:any, newValue:any) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
   <AppBar className={classes.AppBar}position="static">
     <Tabs variant ='fullWidth' value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab fullWidth={true} className={classes.Tab}label="Supply" {...a11yProps(0)} />
        <Tab fullWidth={true} label="Withdraw" {...a11yProps(1)} />
      </Tabs>
    </AppBar>
    <SupplyTabPanel value={value} index={0}>
      <SupplyTab asset={props.asset}icon={props.icon}/>
    </SupplyTabPanel>
    <SupplyTabPanel value={value} index={1}>
    <WithdrawTab asset={props.asset} icon={props.icon}/>
   </SupplyTabPanel>
     
    </div>
  );
}