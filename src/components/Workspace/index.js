import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { search } from "../../store/actions";
import Toolbar from "./Toolbar";
import Results from "./Results";
import InfoBoxes from "./InfoBoxes";

class WorkspaceContainer extends PureComponent {
  handleListTypeChange (listType) {
    this.props.updateSearchParams({ listType });
  }
  render() {
    let handleListTypeChange = this.handleListTypeChange.bind(this);
    let { listType } = this.props;
    return Workspace({ listType, handleListTypeChange });
  }
}

const Workspace = ({ listType, handleListTypeChange }) => (
  <section id="workspace" className="column full flex space-between">
    <div className="center grow full full-height">
      <InfoBoxes />
      <div>
        <Toolbar listType={listType} handleListTypeChange={handleListTypeChange} />
        <Results listType={listType} />
      </div>
    </div>
  </section>
);

function mapStateToProps({ search }) {
  const { listType } = search;
  return {
    listType
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSearchParams: bindActionCreators(search.assignSearchParams, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceContainer);