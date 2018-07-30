import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Table } from "antd";

const blacklistedKeys = ["@id"];

const labelMapping = {
  "@type": {
    label: "Category"
  }
};

function makeDataSourceFromResults(results) {
  return results.map(entry => {
    return {
      ...entry._source
    };
  });
}

function renderEntry(entry) {
  // if (entry["@type"] === Cell) {
  //   return (
  //     <TypeIcon iconUrl
  //   )
  // }
  if (entry.label) {
    return <span>{entry.label}</span>;
  }
  if (Array.isArray(entry)) {
    return <span>Hmm...</span>;
  }
  if (typeof entry === "string") {
    return <span>{entry}</span>;
  }
  return <span></span>
}

function makeColumnsFromDataSource(results) {
  let keysWhitelist = Object.keys(results[0]).filter(
    key => key.indexOf(blacklistedKeys) === -1
  );
  let columns = keysWhitelist.map(key => {
    let title = key;
    if (labelMapping[key]) {
      title = labelMapping[key].label;
    }
    return {
      title,
      dataIndex: key,
      key,
      render: renderEntry
    };
  });
  return columns;
}

const TableComponent = ({ results }) => {
  const dataSource = makeDataSourceFromResults(results);
  const columns = makeColumnsFromDataSource(dataSource);
  const tableOptions = {
    pagination: false
  };
  return <Table rowKey={record => record['@id']} dataSource={dataSource} columns={columns} {...tableOptions} />;
};

class TableContainer extends React.PureComponent {
  render() {
    const { results } = this.props;
    return TableComponent({ results });
  }
}

TableContainer.propTypes = {
  results: PropTypes.any
};

function mapStateToProps({}) {
  return {};
}

export default connect(mapStateToProps)(TableContainer);
