import { AppBar, Button, CssBaseline, Toolbar } from "@material-ui/core";
import React, { Component } from "react";

import CreateEventForm from "./CreateEventForm";
import { GoogleLogin } from "react-google-login";
import Members from "./Members";
import PastEvents from "./PastEvents";
import UpcomingEvents from "./UpcomingEvents";
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

  showView = view => {
    this.resetVisibility();
    this.setState({ [view]: true });
  };

  resetVisibility = () => {
    Object.entries(initialVisibilitiesState).forEach(e => {
      this.setState({ [e[0]]: false });
    });
  };

  handleCreateNewEvent = ({ venue, date }) => {
    axios
      .post(
        "http://localhost:8080/api/events",
        { venue, date },
        {
          headers: {
            "x-auth-token": this.state.token
          }
        }
      )
      .then(res => {
        this.fetchEvents();
        this.showView("isUpcomingEventsVisible");
      });
  };

  handleApproveMember = member => {
    axios
      .put(
        `http://localhost:8080/api/members/${member._id}`,
        {
          allowedOperations: ["read", "create", "update", "delete"]
        },
        {
          headers: {
            "x-auth-token": this.state.token
          }
        }
      )
      .then(() => {
        this.fetchMembers();
      });
  };

  render() {
    const {
      events,
      isAuthenticated,
      isCreateEventVisible,
      isMembersVisible,
      isPastEventsVisible,
      isUpcomingEventsVisible,
      members,
      token
    } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            {isAuthenticated ? (
              <React.Fragment>
                <Button onClick={() => this.showView("isMembersVisible")}>
                  Members
                </Button>
                <Button
                  onClick={() => this.showView("isUpcomingEventsVisible")}
                >
                  Upcoming Events
                </Button>
                <Button onClick={() => this.showView("isPastEventsVisible")}>
                  Past Events
                </Button>
                <Button onClick={() => this.showView("isCreateEventVisible")}>
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
        <Members
          isVisible={isMembersVisible}
          members={members}
          onApproveMember={this.handleApproveMember}
        />
        <UpcomingEvents
          events={events.filter(e => !isPastEvent(e.date))}
          fetchEvents={this.fetchEvents}
          isVisible={isUpcomingEventsVisible}
          token={token}
        />
        <PastEvents
          events={events.filter(e => isPastEvent(e.date))}
          fetchEvents={this.fetchEvents}
          isVisible={isPastEventsVisible}
          members={members}
          token={token}
        />
        <CreateEventForm
          isVisible={isCreateEventVisible}
          onCreateNewEvent={this.handleCreateNewEvent}
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
  isUpcomingEventsVisible: false,
  isPastEventsVisible: false,
  isCreateEventVisible: false
};

function isPastEvent(date) {
  const today = new Date();
  const eventDate = new Date(date);

  return today > eventDate;
}
