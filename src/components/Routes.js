import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { goBack } from "connected-react-router";
import { Route, Switch } from "react-router";
import PrivateRoute from "./PrivateRoute";
import Home from "./Home";
import Details from "./Details";
import WithModal from "./WithModal";
import PleaseLogin from "./PleaseLogIn";
import { auth } from "../store/actions";
import Layout from "./Layout";
import NotFound from "./NotFound";

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
  UNSAFE_componentWillMount() {
    this.props.authenticate(window.location.href);
    console.log("attempting to authenticate", window.location.href);
  }
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
    const { location, goBack } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render

    let DetailsWithModal = WithModal(Details);
    return (
      <Fragment>
        <Switch location={isModal ? this.previousLocation : location}>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute path="/docs/:id" component={props => {
            return (
              <Layout>
                <section className="column full flex">
                  <div className="centered-content">
                    <Details {...props}/>
                  </div>
                </section>
              </Layout>
          )
          }} />
          <Route path="/login" component={PleaseLogin} />
          <Route component={NotFound} />
        </Switch>
        {isModal ? <PrivateRoute path="/docs/:id" component={props => {
          return <DetailsWithModal onCancel={() => goBack() } {...props} />;
        }} /> : null}
      </Fragment>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: bindActionCreators(goBack, dispatch),
    authenticate: bindActionCreators(auth.authenticate, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes);