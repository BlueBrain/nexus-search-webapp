import React from "react";
import Toolbar from "./Toolbar";
import Results from "./Results";

const DEFAULT_LIST_TYPE_VALUE = "Table";

class WorkspaceContainer extends React.PureComponent {
  state = {
    listType: DEFAULT_LIST_TYPE_VALUE
  };
  handleListTypeChange (listType) {
    this.setState({ listType })
  }
  render() {
    let handleListTypeChange = this.handleListTypeChange.bind(this);
    let { listType } = this.state;
    return Workspace({ listType, handleListTypeChange });
  }
}

const Workspace = ({ listType, handleListTypeChange }) => (
  <section id="workspace" className="column full flex space-between">
    <div className="center grow full full-height">
      <Toolbar listType={listType} handleListTypeChange={handleListTypeChange} />
      <Results listType={listType} />
    </div>
  </section>
);

export default WorkspaceContainer;
