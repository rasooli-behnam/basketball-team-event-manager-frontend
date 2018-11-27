import { AppBar, Button, CssBaseline, Toolbar } from "@material-ui/core";
import React, { Component } from "react";

import Events from "./Events";

class App extends Component {
  constructor() {
    super();

    this.state = {
      ...initialVisibilitiesState
    };
  }

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

  render() {
    const { isEventsVisible, isPastEvents } = this.state;

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
        <Events isVisible={isEventsVisible} isPastEvents={isPastEvents} />
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
