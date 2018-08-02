import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router";
import App from "./App";
import Home from "./Home";
import Details from "./Details";
import WithModal from "./WithModal";

class Routes extends Component {
  // We can pass a location to <Switch/> that will tell it to
  // ignore the router's current location and use the location
  // prop instead.
  //
  // We can also use "location state" to tell the app the user
  // wants to go to `/docs/2` in a modal, rather than as the
  // main page, keeping the gallery visible behind it.
  //
  // Normally, `/docs/2` wouldn't match the gallery at `/`.
  // So, to get both screens to render, we can save the old
  // location and pass it to Switch, so it will think the location
  // is still `/` even though its `/docs/2`.
  previousLocation = this.props.location;
  componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    const { location } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render

    let DetailsWithModal = WithModal(Details);
    return (
      <App>
        <Fragment>
          <Switch location={isModal ? this.previousLocation : location}>
            <Route exact path="/" component={Home} />
            <Route path="/docs/:id" component={Details} />
          </Switch>
          {isModal ? <Route path="/docs/:id" component={DetailsWithModal} /> : null}
        </Fragment>
      </App>
    );
  }
}

export default Routes;