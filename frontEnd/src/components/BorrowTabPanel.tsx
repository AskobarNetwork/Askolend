import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {SupplyTab} from './SupplyTab'
import {RepayTab} from './RepayTab'
function BorrowTabPanel(props:any) {
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

BorrowTabPanel.propTypes = {
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
        backgroud:'#f9fafb',
        color:'#a981ef'
    },
    AppBar:{
        backgroundColor:'#f9fafb',
        color:'	#a981ef'
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

  const handleChange = (event:any, newValue:any) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
   <AppBar className={classes.AppBar}position="static">
     <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab className={classes.Tab}label="Borrow" {...a11yProps(0)} />
        <Tab label="Repay" {...a11yProps(1)} />
      </Tabs>
    </AppBar>
    <BorrowTabPanel value={value} index={0}>
      <RepayTab />
    </BorrowTabPanel>
    <BorrowTabPanel value={value} index={1}>
    <RepayTab />
   </BorrowTabPanel>
     
    </div>
  );
}