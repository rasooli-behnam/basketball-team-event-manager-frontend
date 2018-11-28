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

class UpcomingEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      isUpdateEventFormVisible: false,
      members: [],
      targetEvent: {}
    };
  }

  handleRowClick = eventData => {
    this.setState({ isUpdateEventFormVisible: true, targetEvent: eventData });
  };

  handleUpdateEventFormSubmit = ({ _id, payer, bill_amount }) => {
    axios
      .put(
        `http://localhost:8080/api/events/${_id}`,
        {
          memberId: payer,
          billAmount: bill_amount
        },
        {
          headers: {
            "x-auth-token": this.props.token
          }
        }
      )
      .then(() => {
        this.props.fetchEvents();
        this.setState({ isUpdateEventFormVisible: false });
      });
  };

  render() {
    const { isUpdateEventFormVisible, targetEvent } = this.state;
    const { events, isVisible, members } = this.props;

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
                  <TableCell>Payer</TableCell>
                  <TableCell>Bill Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map(e => {
                  console.log(e);
                  return (
                    <TableRow
                      key={e._id}
                      onClick={() => this.handleRowClick(e)}
                    >
                      <TableCell>{e.venue}</TableCell>
                      <TableCell>
                        {new Date(e.date).toJSON().substr(0, 16)}
                      </TableCell>
                      <TableCell>{e.created_by.name}</TableCell>
                      {e.payer && <TableCell>{e.payer.name}</TableCell>}
                      {e.bill_amount && <TableCell>{e.bill_amount}</TableCell>}
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

export default UpcomingEvents;
