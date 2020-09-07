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
function TabPanel(props) {
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
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
    width:400,
    color:'white',
    backgroundColor:'#f9fafb'

  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
   <AppBar className={classes.AppBar}position="static">
     <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab className={classes.Tab}label="Supply" {...a11yProps(0)} />
        <Tab label="Withdraw" {...a11yProps(1)} />
      </Tabs>
    </AppBar>
    <TabPanel value={value} index={0}>
      <SupplyTab />
    </TabPanel>
    <TabPanel value={value} index={1}>
    <WithdrawTab />
   </TabPanel>
     
    </div>
  );
}