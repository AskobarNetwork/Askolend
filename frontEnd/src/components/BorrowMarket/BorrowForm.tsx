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

export default class BorrowForm extends React.Component<{},{value:string}> {
  //having difficulty providing themes/styling to this component 
  constructor(props:any) {
    
    super(props);
    this.state = {value: ''};
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event:any) {
    //web3 validation stuff here
    
    this.setState({value: event.target.value});
    console.log(event.target.value)
  }
  
  handleSubmit(event:any) {
    //web3 finalized stuff here
    console.log('submitted' + this.state.value);
    event.preventDefault();
  }
  
  render() {
      return (
        <Container>
        <form onSubmit={this.handleSubmit}>
      <Input required={true}fullWidth={true} type="number" value={this.state.value} onChange={this.handleChange} placeholder={'0'} />
        </form>
        </Container>

        
      );
    }
  }

const useStyles = makeStyles((theme) => ({
    Header:{
     color:'black',
     height:100,

    },
}));