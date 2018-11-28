import { AppBar, Button, CssBaseline, Toolbar } from "@material-ui/core";
import React, { Component } from "react";

import CreateEventForm from "./CreateEventForm";
import Events from "./Events";
import { GoogleLogin } from "react-google-login";
import axios from "axios";

class App extends Component {
  constructor() {
    super();

    this.state = {
      ...initialVisibilitiesState,
      events: [],
      members: [],
      isAuthenticated: false,
      token: ""
    };
  }

  fetchEvents = () => {
    axios
      .get("http://localhost:8080/api/events", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.state.token
        }
      })
      .then(res => this.setState({ events: res.data }));
  };

  fetchMembers = () => {
    axios
      .get("http://localhost:8080/api/members", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.state.token
        }
      })
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

  render() {
    const {
      events,
      isAuthenticated,
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
            {isAuthenticated ? (
              <React.Fragment>
                <Button onClick={() => this.showView(["isMembersVisible"])}>
                  Members
                </Button>
                <Button
                  onClick={() => this.showView(["isPendingMembersVisible"])}
                >
                  Pending Members
                </Button>
                <Button onClick={() => this.showView(["isEventsVisible"])}>
                  Upcoming Events
                </Button>
                <Button
                  onClick={() =>
                    this.showView(["isEventsVisible", "isPastEvents"])
                  }
                >
                  Past Events
                </Button>
                <Button onClick={() => this.showView(["isCreateEventVisible"])}>
                  Create new Event
                </Button>
              </React.Fragment>
            ) : (
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_KEY}
                buttonText="Login"
                onSuccess={this.googleResponse}
                onFailure={this.googleResponse}
              />
            )}
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

  logout = () => {
    this.setState({ isAuthenticated: false, token: "", user: null });
  };

  googleResponse = response => {
    axios
      .post(
        "http://localhost:8080/api/login",
        {},
        { headers: { "x-auth-token": response.tokenId } }
      )
      .then(() => {
        this.setState({ isAuthenticated: true, token: response.tokenId });
        setTimeout(() => {
          this.fetchEvents();
          this.fetchMembers();
        }, 300);
      });
  };
}

export default App;

const initialVisibilitiesState = {
  isMembersVisible: false,
  isPendingMembersVisible: false,
  isEventsVisible: false,
  isPastEvents: false,
  isCreateEventVisible: false
};
