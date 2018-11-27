import { AppBar, Button, CssBaseline, Toolbar } from "@material-ui/core";
import React, { Component } from "react";

import CreateEventForm from "./CreateEventForm";
import Events from "./Events";
import axios from "axios";

class App extends Component {
  constructor() {
    super();

    this.state = {
      ...initialVisibilitiesState,
      events: [],
      members: []
    };
  }

  UNSAFE_componentWillMount() {
    this.fetchEvents();
    this.fetchMembers();
  }

  fetchEvents = () => {
    axios
      .get("http://localhost:8080/api/events")
      .then(res => this.setState({ events: res.data }));
  };

  fetchMembers = () => {
    axios
      .get("http://localhost:8080/api/members")
      .then(res => this.setState({ members: res.data }));
  };

  showView = visibilities => {
    this.resetVisibility();
    visibilities.forEach(x => {
      this.setState({ [x]: true });
    });
  };

  resetVisibility = () => {
    Object.entries(initialVisibilitiesState).forEach(e => {
      this.setState({ [e[0]]: false });
    });
  };

  handleCreateEvent = () => {
    this.showView(["isEventsVisible"]);
  };

  render() {
    const {
      events,
      isCreateEventVisible,
      isEventsVisible,
      isPastEvents,
      members
    } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Button onClick={() => this.showView(["isMembersVisible"])}>
              Members
            </Button>
            <Button onClick={() => this.showView(["isPendingMembersVisible"])}>
              Pending Members
            </Button>
            <Button onClick={() => this.showView(["isEventsVisible"])}>
              Upcoming Events
            </Button>
            <Button
              onClick={() => this.showView(["isEventsVisible", "isPastEvents"])}
            >
              Past Events
            </Button>
            <Button onClick={() => this.showView(["isCreateEventVisible"])}>
              Create new Event
            </Button>
          </Toolbar>
        </AppBar>
        <Events
          events={events}
          fetchEvents={this.fetchEvents}
          isVisible={isEventsVisible}
          isPastEvents={isPastEvents}
          members={members}
        />
      </React.Fragment>
    );
  }
}

export default App;

const initialVisibilitiesState = {
  isMembersVisible: false,
  isPendingMembersVisible: false,
  isEventsVisible: false,
  isPastEvents: false,
  isCreateEventVisible: false
};
