import { Button, MenuItem, Paper, TextField } from "@material-ui/core";
import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";

class UpdateEventForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payer: {},
      billAmount: 0
    };
  }

  handlePayerChange = input => event => {
    this.setState({ [input]: event.target.value });
  };

  handleBillAmountChange = input => event => {
    this.setState({ [input]: Number.parseFloat(event.target.value) });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    const { payer, billAmount } = this.state;
    const eventData = {
      ...this.props.eventData,
      payer,
      bill_amount: billAmount
    };

    this.props.onFormSubmit(eventData);
  };

  render() {
    const { payer, billAmount } = this.state;
    const { classes, eventData, members } = this.props;

    return (
      <Paper className={classes.root} tabIndex={-1}>
        <form onSubmit={this.handleFormSubmit}>
          <br />
          <TextField
            className={classes.textField}
            label="Venue"
            value={eventData.venue}
            variant="outlined"
            disabled={true}
            margin="normal"
          />
          <br />
          <TextField
            className={classes.textField}
            label="Date"
            value={new Date(eventData.date).toJSON().substr(0, 16)}
            variant="outlined"
            disabled={true}
            margin="normal"
          />
          <br />
          {members.length > 0 && (
            <TextField
              select
              className={classes.textField}
              label="Payer"
              value={payer}
              onChange={this.handlePayerChange("payer")}
              variant="outlined"
              margin="normal"
            >
              {members.map(m => (
                <MenuItem key={m._id} value={m._id}>
                  {m.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          <br />
          <TextField
            className={classes.textField}
            label="Bill Amount"
            value={billAmount}
            onChange={this.handleBillAmountChange("billAmount")}
            variant="outlined"
            margin="normal"
          />
          <br />
          <Button variant="contained" type="submit">
            Update Event
          </Button>
        </form>
      </Paper>
    );
  }
}

const styles = {
  root: {
    width: 600,
    padding: 25,
    margin: "10px auto"
  },
  textField: { width: 550 }
};

export default withStyles(styles)(UpdateEventForm);
