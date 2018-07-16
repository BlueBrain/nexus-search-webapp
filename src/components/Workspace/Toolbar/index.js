import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Icon, Radio } from "antd";
import ResultCounter from "./ResultCounter";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ToolbarContainer extends React.PureComponent {
  render() {
    let handleListTypeChange = e => { this.props.handleListTypeChange(e.target.value) };
    let { listType, resultCount } = this.props;
    return Toolbar({ resultCount, listType, handleListTypeChange });
  }
}

ToolbarContainer.propTypes = {
  handleListTypeChange: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
  listType: PropTypes.string.isRequired,
};

function mapStateToProps({ query }) {
  return {
    resultCount: query.hits,
  };
}

const Toolbar = ({ resultCount, listType, handleListTypeChange }) => {
  return (
    <div className="search-toolbar flex space-between">
      <ResultCounter resultCount={resultCount} />
      <div className="">
        <RadioGroup onChange={handleListTypeChange} defaultValue={listType}>
          <RadioButton value="Grid">
            <Icon type="appstore-o" />
          </RadioButton>
          <RadioButton value="Panel">
            <Icon type="appstore-o" />
          </RadioButton>
          <RadioButton value="Table">
            <Icon type="profile" />
          </RadioButton>
        </RadioGroup>
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps
)(ToolbarContainer);
