import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

const Stuff = ({ isAuthenticated, ...props }) => {
  console.log("this ist stuff", isAuthenticated, props);
  return (
    isAuthenticated ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: props.location }
        }}
      />
    )
  )
}

class PrivateRoute extends Component {
  render() {
    let { component, isAuthenticated, ...rest } = this.props
    let Component = component;
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.auth.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateRoute);
