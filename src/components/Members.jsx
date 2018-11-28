import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import React, { Component } from "react";

class Members extends Component {
  render() {
    const { isVisible, members } = this.props;
    return (
      isVisible && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map(m => (
                <TableRow key={m._id}>
                  <TableCell>{m.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )
    );
  }
}

export default Members;
