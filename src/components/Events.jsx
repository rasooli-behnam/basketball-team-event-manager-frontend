import {
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import React, { Component } from "react";

import UpdateEventForm from "./UpdateEventForm";
import axios from "axios";

class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      isUpdateEventFormVisible: false,
      members: [],
      targetEvent: {}
    };
  }

  UNSAFE_componentWillMount() {
    this.fetchData();
  }

  fetchData = () => {
    axios
      .get("http://localhost:8080/api/events")
      .then(res => this.setState({ events: res.data }));

    axios
      .get("http://localhost:8080/api/members")
      .then(res => this.setState({ members: res.data }));
  };

  handleRowClick = eventData => {
    this.setState({ isUpdateEventFormVisible: true, targetEvent: eventData });
  };

  handleUpdateEventFormSubmit = ({ _id, payer, bill_amount }) => {
    axios
      .put(`http://localhost:8080/api/events/${_id}`, {
        memberId: payer,
        billAmount: bill_amount
      })
      .then(() => {
        this.fetchData();
        this.setState({ isUpdateEventFormVisible: false });
      });
  };

  render() {
    const {
      events,
      isUpdateEventFormVisible,
      members,
      targetEvent
    } = this.state;
    const { isVisible, isPastEvents } = this.props;

    return (
      <React.Fragment>
        {isVisible && (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Venue</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Created By</TableCell>
                  {isPastEvents && (
                    <React.Fragment>
                      <TableCell>Payer</TableCell>
                      <TableCell>Bill Amount</TableCell>
                    </React.Fragment>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map(e => {
                  return (
                    <TableRow
                      key={e._id}
                      onClick={() => this.handleRowClick(e)}
                    >
                      <TableCell>{e.venue}</TableCell>
                      <TableCell>{e.date}</TableCell>
                      <TableCell>{e.created_by}</TableCell>
                      {isPastEvents && (
                        <React.Fragment>
                          <TableCell>{e.payer}</TableCell>
                          <TableCell>{e.bill_amount}</TableCell>
                        </React.Fragment>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
        <Modal
          open={isUpdateEventFormVisible}
          onClose={() => this.setState({ isUpdateEventFormVisible: false })}
        >
          <UpdateEventForm
            eventData={targetEvent}
            members={members}
            onFormSubmit={this.handleUpdateEventFormSubmit}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default Events;
