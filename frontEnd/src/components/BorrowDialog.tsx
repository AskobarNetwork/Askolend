import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { BigNumber, ethers } from "ethers";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import { SupplyToken, Token } from "../models";
import { MoneyMarketInstanceService } from "services/MoneyMarketInstance";
import { connect } from "react-redux";
import { getTokenLogoPngSrc } from "../models";
import { withStyles } from "@material-ui/styles";
import { ProtocolProvider } from "../web3";
import { isNull } from "util";

const styles = (theme: any) => ({
  borrowDialog: {
    textAlign: "center",
  },
});

interface IBorrowDialogProps {
  askoTokens: any;
  borrow: Function;
  repay: Function;
  borrowClose: Function;
  borrowEnable: Function;
  borrowOpen: boolean;
  token: any | undefined;
  withdraw: Function;
  classes?: any;
  collateralAddress?: string;
}

interface IBorrowDialogState {
  amount: number;
  borrow: boolean;
  value: string;
  select: string;
  dropList: any[];
  collateral: string;
  borrowLimit: string;
  borrowedAmount: string;
}

class BorrowDialogClass extends React.Component<
  IBorrowDialogProps,
  IBorrowDialogState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      amount: 0,
      borrow: true,
      value: "1",
      select: "",
      dropList: [],
      collateral: "",
      borrowLimit: "",
      borrowedAmount: "",
    };
    this.handleChange.bind(this);
    this.handleSelect.bind(this);
  }

  handleSelect = async (event: any) => {
    await this.setState({ select: event.target.value });
    for (const index in this.props.askoTokens) {
      if (
        index !== "__jsonObjectId" &&
        this.props.askoTokens[index].name !== this.props.token.name
      ) {
        if (this.props.askoTokens[index].lowRiskAddress === this.state.select) {
          this.setState({
            borrowLimit: this.props.askoTokens[index].borrowLimit,
          });
        }
      }
    }
  };

  makeList = () => {
    let list = [];
    if (this.props.askoTokens && this.props.token) {
      for (const index in this.props.askoTokens) {
        if (
          index !== "__jsogObjectId" &&
          this.props.askoTokens[index].name !== this.props.token.name
        ) {
          list.push(
            <MenuItem value={this.props.askoTokens[index].lowRiskAddress}>
              {this.props.askoTokens[index].name}
            </MenuItem>
          );
        }
      }
    }
    return list;
  };

  borrowEnable = (title: string) => {
    // this.props.borrowClose();
    // this.props.borrowEnable(
    // 	!this.props.token?.token.supplyEnabled,
    // 	this.props.token,
    // 	title
    // );
    // console.log("SUPPLY ENABLED ",this.props.token?.token.supplyEnabled)
    // console.log("BORROW ENABLED ",this.props.token?.token.borrowEnabled)
  };

  handleChange = (event: any, newValue: any) => {
    this.setState({ borrow: !this.state.borrow, value: newValue });
    console.log("BTOKEN!", this.props.token);
  };

  canWithdraw = (): boolean => {
    if (this.props.token === undefined) {
      return false;
    }
    const withdrawAmount = ProtocolProvider.toWei(this.state.amount);
    const balance = ProtocolProvider.toWei(this.props.token?.balance);

    return withdrawAmount.lte(balance);
  };

  render() {
    {
      console.log("ASKOTOKENS TEST 2", this.props.askoTokens);
    }
    const selectList = this.makeList();
    const Message =
      this.props.token?.supplyEnabled === false ? (
        <Typography variant="subtitle1">
          To borrow or repay {this.props.token?.asset} you must enable it first.
        </Typography>
      ) : (
        <React.Fragment>
          <Typography variant="subtitle1">
            {this.state.borrow ? "Borrow" : "Repay"} {this.state.amount}{" "}
            {this.props.token?.name}
          </Typography>
          {/* <Typography>{"Current Balance: "} {this.props.token?.balance}</Typography> */}
          <TextField
            type="number"
            value={this.state.amount}
            InputProps={{ inputProps: { min: 0 } }}
            onChange={(event: any) => {
              this.setState({ amount: Number(event.target.value) });
            }}
          />
          {this.state.borrow ? (
            <FormControl>
              <InputLabel id="collateral">Select Collateral</InputLabel>
              <Select
                labelId="collateral"
                value={this.state.select}
                onChange={this.handleSelect}
              >
                {selectList}
                {console.log("ASKOTOKENS ARRIVED?", this.props.askoTokens)}
              </Select>
            </FormControl>
          ) : null}
        </React.Fragment>
      );

    return (
      <Dialog
        className={this.props.classes.borrowDialog}
        open={this.props.borrowOpen}
        onClose={() => this.props.borrowClose()}
        transitionDuration={0}
        onClick={(event) => event.stopPropagation()}
        hideBackdrop={true}
        fullWidth={true}
      >
        <DialogTitle>
          <Grid container justify="flex-end">
            <IconButton onClick={() => this.props.borrowClose()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center">
            <Avatar
              src={getTokenLogoPngSrc(this.props.token?.address || "")}
              alt={this.props.token?.asset}
            />{" "}
            &nbsp;
            <Typography>{this.props.token?.asset}</Typography>
          </Grid>
        </DialogTitle>
        <DialogContent className={this.props.classes.tabs}>
          <Grid container direction="column">
            {Message}
            <TabContext value={this.state.value}>
              <TabList onChange={this.handleChange} variant="fullWidth">
                <Tab label="Borrow" value="1" />
                <Tab label="Repay" value="2" />
              </TabList>
              <TabPanel value="1">
                <Table>
                  {/* <TableBody>
                    <TableRow>
                      <TableCell>Borrow APY</TableCell>
                      <TableCell>"APY"</TableCell>
                    </TableRow>
                  </TableBody> */}
                </Table>
              </TabPanel>
              <TabPanel value="2">
                <Table>
                  <TableBody>
                    {/* <TableRow>
                      <TableCell>Borrow APY</TableCell>
                      <TableCell>"APY"</TableCell>
                    </TableRow> */}
                    {/* { this.props.token?.lowRisk ? 
                                        <TableRow>
                                            <TableCell>
                                                Borrow Limit
                                        </TableCell>
                                            <TableCell>
                                                ${0} &#x2192; $0
                                        </TableCell>
                                        </TableRow> : null }
                                        { this.props.token?.lowRisk ? 
                                        <TableRow>
                                            <TableCell>
                                                Borrow Limit Used
                                        </TableCell>
                                            <TableCell>
                                                {0}% &#x2192; 0%
                                        </TableCell>
                                        </TableRow>
                                        : null } */}
                  </TableBody>
                </Table>
              </TabPanel>
            </TabContext>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container direction="column">
            <Grid container item xs={12}>
              <Button
                color="secondary"
                fullWidth={true}
                variant="contained"
                disabled={
                  this.props.token?.supplyEnabled && this.state.amount <= 0
                }
                onClick={() =>
                  this.state.borrow === true
                    ? this.props.token?.supplyEnabled === false
                      ? this.borrowEnable(
                          `Enable ${this.props.token?.asset} as Supply`
                        )
                      : this.props.borrow(
                          this.state.select,
                          this.state.amount,
                          this.props.token?.marketAddress
                        )
                    : this.props.token?.supplyEnabled === false
                    ? this.borrowEnable(
                        `Enable ${this.props.token?.asset} as Supply`
                      )
                    : this.props.repay(
                        this.state.amount,
                        this.props.token?.marketAddress
                      )
                }
              >
                {this.state.borrow === true
                  ? this.props.token?.supplyEnabled === false
                    ? null
                    : "Borrow"
                  : this.props.token?.supplyEnabled === false
                  ? null
                  : "Repay"}
              </Button>
            </Grid>
            <Table>
              <TableBody>
                <TableRow>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                  >
                    <TableCell>
                      {this.state.borrow === true
                        ? "Borrow Limit"
                        : "Currently Borrowing"}
                    </TableCell>
                    <TableCell>
                      {this.state.borrow === true
                        ? this.state.borrowLimit
                        : this.props.token?.borrowedAmount}
                    </TableCell>
                  </Grid>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {};
};

// @ts-ignore
const UnconnectedBorrowDialogClass: any = withStyles(styles)(BorrowDialogClass);
const BorrowDialog = connect(
  mapStateToProps,
  null
)(UnconnectedBorrowDialogClass);

export { BorrowDialog };
