import React from "react";
import SearchResults from "./SearchResults";

class WorkspaceContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return Workspace();
  }
}

const Workspace = () => (
  <section id="workspace" className="column full flex space-between">
    <div className="center grow full full-height">
      <SearchResults />
    </div>
  </section>
);

export default WorkspaceContainer;
