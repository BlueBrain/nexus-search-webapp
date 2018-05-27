import React from "react";
import SearchResults from "./SearchResults";
import SearchBar from "./SearchBar";

class WorkspaceContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return Workspace();
  }
}

const Workspace = () => (
<section id="search-results" className="column flex space-between">
  <div className="">
  {/* <SearchBar /> */}
  </div>
  <div className="center grow">
  <SearchResults/>
  </div>
</section>
);

export default WorkspaceContainer;
