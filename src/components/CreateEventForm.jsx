import { Button, Paper, TextField } from "@material-ui/core";
import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";

class CreateEventForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      venue: "",
      date: new Date().toJSON().substr(0, 16)
    };
  }

  handleChange = input => event => {
    this.setState({ [input]: event.target.value });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    const { venue, date } = this.state;
    this.props.onCreateNewEvent({ venue, date });
  };

  render() {
    const { venue, date } = this.state;
    const { classes, isVisible } = this.props;

    return (
      isVisible && (
        <Paper className={classes.root} tabIndex={-1}>
          <form onSubmit={this.handleFormSubmit}>
            <br />
            <TextField
              className={classes.textField}
              label="Venue"
              value={venue}
              onChange={this.handleChange("venue")}
              variant="outlined"
              margin="normal"
            />
            <br />
            <TextField
              className={classes.textField}
              label="Date"
              type="datetime-local"
              value={date}
              onChange={this.handleChange("date")}
              variant="outlined"
              margin="normal"
            />
            <br />
            <Button variant="contained" type="submit">
              Create Event
            </Button>
          </form>
        </Paper>
      )
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

export default withStyles(styles)(CreateEventForm);
