import React, { PureComponent, Fragment } from "react";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router";

class PrivateRoute extends PureComponent {
  render() {
    let { component, isAuthenticated, search, ...rest } = this.props
    console.log("privateRoute rendering", search);
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
                pathname: "/login" ,
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
    search: state.router.location.search,
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
