
import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { instance, types } from  "../../store/actions";
import DetailsViewComponent from "./DetailsComponent";
import { getProp } from "../../libs/utils";

class DetailsViewContainer extends PureComponent {
  componentDidMount () {
    let id = getProp(this.props, "match.params.id");
    if (id) {
      this.props.fetchInstance(id);
    }
    // We don't have types info if this page is the first displayed
    if (!this.props.types.length) {
      // TODO fetch Types with query to limit results
      this.props.fetchTypes();
    }
  }
  render( ) {
    return <DetailsViewComponent {...this.props} />;
  }
}

DetailsViewContainer.propTypes = {
  pending: PropTypes.bool.isRequired,
  data: PropTypes.any,
  error: PropTypes.any,
  useModal: PropTypes.bool.isRequired
};

function mapStateToProps({ instance, types }) {
  return {
    types: types.types,
    ...instance
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTypes: bindActionCreators(types.fetchTypes, dispatch),
    fetchInstance: bindActionCreators(instance.fetchInstance, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsViewContainer);
