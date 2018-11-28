import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import React, { Component } from "react";

import axios from "axios";

class UpcomingEvents extends Component {
  handleDeleteEvent = eventData => {
    axios
      .delete(`http://localhost:8080/api/events/${eventData._id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.props.token
        }
      })
      .then(() => {
        this.props.fetchEvents();
      });
  };

  render() {
    const { events, isVisible } = this.props;

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
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map(e => {
                  return (
                    <TableRow key={e._id}>
                      <TableCell>{e.venue}</TableCell>
                      <TableCell>
                        {new Date(e.date).toJSON().substr(0, 16)}
                      </TableCell>
                      <TableCell>{e.created_by.name}</TableCell>
                      <TableCell onClick={() => this.handleDeleteEvent(e)}>
                        Delete
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        )}
      </React.Fragment>
    );
  }
}

export default UpcomingEvents;
