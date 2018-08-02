import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { navigate } from  "../../../store/actions";

class InspectLink extends PureComponent {
  render() {
    const { id, goToDetailsPageByID } = this.props;
    return (
      <a
        href={"docs/" + id}
        onClick={e => {
          e.preventDefault();
          goToDetailsPageByID(id);
        }}
        style={{ padding: "2em" }}
      >
        Inspect
      </a>
    );
  }
}

InspectLink.propTypes = {
  goToDetailsPageByID: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    goToDetailsPageByID: bindActionCreators(
      navigate.goToDetailsPageByID,
      dispatch
    )
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectLink);
