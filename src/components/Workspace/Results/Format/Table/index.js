import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Table, Icon } from "antd";
import { Link } from "react-router-dom";
import Contributions from "../../../../Cards/Cell/Contributions";
import { search } from "../../../../../store/actions";
import { toTitleCase, toSpacedWords } from "../../../../../libs/string";
import { getProp } from "../../../../../libs/utils";

const blacklistedKeys = ["@id", "traces"];
// TODO get from SCHEMA
const nonSortableKeys = ["patchedCell", "contributions", "distribution", "subject", "morphology"];

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

const defaultEntry = entry => {
  if (!entry) {
    return <span></span>;
  }
  if (entry.label) {
    return (
      <span>{entry.label}</span>
    );
  }
  if (Array.isArray(entry)) {
    return <span></span>;
  }
  if (typeof entry === "string") {
    return <span>{entry}</span>;
  }
  return <span></span>
}
const renderType = key => entry => {
  switch (key) {
    case "contributions":
      return <Contributions contributions={entry} />
    break;
    default:
      return defaultEntry(entry);
    break;
  }
  // if (entry["@type"] === Cell) {
  //   return (
  //     <TypeIcon iconUrl
  //   )
  // }
}

function makeColumnsFromDataSource(results, sort) {
  let keysWhitelist = Object.keys(results[0]).filter(
    key => blacklistedKeys.indexOf(key) === -1
  );
  let columns = keysWhitelist.map(key => {
    let title = toTitleCase(toSpacedWords(key));
    console.log(title, key, labelMapping[key])
    if (labelMapping[key]) {
      title = toTitleCase(toSpacedWords(labelMapping[key].label));
    }
    let sortField = getProp(sort, "field");
    return {
      title,
      dataIndex: key,
      sorter: nonSortableKeys.indexOf(key) === -1,
      sortOrder: sortField && sortField === key ? sort.order + "end" : null,
      key,
      render: renderType(key)
    };
  });
  // Add actions panel
  columns.push({
    title: "Actions",
    key: "action",
    render: (text, record) => {
      let id = record["@id"];
      return (
        <Link
        key={id}
        to={{
          pathname: `/docs/${id}`,
          state: { modal: true }
        }}>
        Inspect
        </Link>
      );
    }
  })
  return columns;
}

const TableComponent = ({ results, handleTableChange, sort }) => {
  const dataSource = makeDataSourceFromResults(results);
  const columns = makeColumnsFromDataSource(dataSource, sort);
  const tableOptions = {
    pagination: false
  };
  return <Table onChange={handleTableChange} rowKey={record => record['@id']} dataSource={dataSource} columns={columns} {...tableOptions} />;
};

class TableContainer extends React.PureComponent {
  handleTableChange (pagination, filters, sorter) {
    let { field, order } = sorter;
    order = order === "descend" ? "desc" : "asc";
    this.props.updateSearchParams({
      sort: {
        field,
        order
      }
    })
  }
  render() {
    const { results, sort } = this.props;
    const handleTableChange = this.handleTableChange.bind(this);
    return TableComponent({ results, handleTableChange, sort });
  }
}

TableContainer.propTypes = {
  results: PropTypes.any
};

function mapStateToProps({ search }) {
  return {
    sort: { ...search.sort}
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSearchParams: bindActionCreators(search.assignSearchParams, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableContainer);
