import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Table, Icon } from "antd";
import { Link } from "react-router-dom";
import Contributions from "../../../../Cards/Cell/Contributions";
import TypeIcon from "../../../../TypeIcon";
import { search } from "../../../../../store/actions";
import { toTitleCase, toSpacedWords } from "@libs/string";
import { getProp } from "@libs/utils";
import { find } from "underscore";

const blacklistedKeys = ["@id", "traces"];
// TODO get from SCHEMA
const nonSortableKeys = [
  "patchedCell",
  "contributions",
  "distribution",
  "subject",
  "morphology"
];

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

function Download({ url }) {
  if (url) {
    return (
      <a href={url} download>
        <Icon type="cloud-download-o" style={{ fontSize: "2em" }} />
      </a>
    );
  } else {
    return <span />;
  }
}

const defaultEntry = entry => {
  if (!entry) {
    return <span />;
  }
  if (entry.label) {
    return <span>{entry.label}</span>;
  }
  if (Array.isArray(entry)) {
    return <span />;
  }
  if (typeof entry === "string") {
    return <span>{entry}</span>;
  }
  return <span />;
};

function Category({ type }) {
  return (
    <div className="flex">
      <div className="type-avatar">
        {type && <TypeIcon color={type.color} iconURL={type.icon} />}
      </div>
      <div>{type.label}</div>
    </div>
  );
}

function Subject({ subject }) {
  return (
    <div className="subject flex column">
      <div className="species">{getProp(subject, "species.label")}</div>
      <div className="strain">{getProp(subject, "strain.label")}</div>
      <div className="sex">({getProp(subject, "sex.label")})</div>
    </div>
  );
}

const renderType = (key, types) => entry => {
  switch (key) {
    case "contributions":
      return <Contributions contributions={entry} />;
      break;
    case "distribution":
      return <Download url={getProp(entry, "url")} />;
      break;
    case "subject":
      return <Subject subject={entry} />;
      break;
    case "@type":
      const myType = find(types, type => {
        return type.value === entry;
      });
      return myType ? <Category type={myType} /> : null;
      break;
    default:
      return defaultEntry(entry);
      break;
  }
};

function makeColumnsFromDataSource(results, sort, types) {
  let keysWhitelist = Object.keys(results[0]).filter(
    key => blacklistedKeys.indexOf(key) === -1
  );
  let columns = keysWhitelist.map(key => {
    let title = toTitleCase(toSpacedWords(key));
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
      render: renderType(key, types)
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
          }}
        >
          Inspect
        </Link>
      );
    }
  });
  return columns;
}

const TableComponent = ({ results, handleTableChange, sort, types }) => {
  const dataSource = makeDataSourceFromResults(results);
  const columns = makeColumnsFromDataSource(dataSource, sort, types);
  const tableOptions = {
    pagination: false
  };
  return (
    <Table
      onChange={handleTableChange}
      rowKey={record => record["@id"]}
      dataSource={dataSource}
      columns={columns}
      {...tableOptions}
    />
  );
};

class TableContainer extends React.PureComponent {
  handleTableChange(pagination, filters, sorter) {
    let { field, order } = sorter;
    order = order === "descend" ? "desc" : "asc";
    this.props.updateSearchParams({
      sort: {
        field,
        order
      }
    });
  }
  render() {
    const { results, sort, types } = this.props;
    const handleTableChange = this.handleTableChange.bind(this);
    return TableComponent({ results, handleTableChange, sort, types });
  }
}

TableContainer.propTypes = {
  results: PropTypes.any
};

function mapStateToProps({ search, types }) {
  return {
    sort: { ...search.sort },
    types: types.types
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
)(TableContainer);
