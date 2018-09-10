import React from "react";
import { Icon, Button, Input, AutoComplete } from "antd";
import RenderOptions from "./RenderOptions";
import DefaultOptions from "./DefaultOptions";

function filterOptionFactory(inputValue) {
  return function filterOption(value, option) {
    const key = option.key;
    // always show the "show all results option"
    if (key === "all") {
      return true;
    }
    // dont show anything if keyboard input is empty
    if (!value || value === "") {
      return false;
    }
    if (!inputValue || inputValue === "") {
      return false;
    }
    const { grouptitle: groupTitle, title } = option.props;
    const lowerCaseValue = value.toLowerCase();
    const lowerCaseGroupKey = groupTitle.toLowerCase();
    const lowerCaseKey = title.toLowerCase();
    const matchesKey = lowerCaseKey.indexOf(lowerCaseValue) >= 0;
    const matchesGroupKey = lowerCaseGroupKey.indexOf(lowerCaseValue) >= 0;
    return matchesKey || matchesGroupKey;
  };
}

//TODO fix bug where searching by exact value will cause dropdown to close
function SearchContainer({
  autocompleteResults,
  onSearch,
  onSelect,
  onChange,
  value
}) {
  let defaultOption = DefaultOptions({ value });
  let dataSource = value === ""
  ? []
  : autocompleteResults.map(group => RenderOptions(group))
  if (value) {
    dataSource.unshift(defaultOption);
  }
  return (
    <div className="global-search-wrapper" style={{ width: 500 }}>
      <AutoComplete
        className="global-search"
        style={{ width: "100%" }}
        autoFocus
        dataSource={dataSource}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
        value={value}
        placeholder="lookup data"
        optionLabelProp="text"
        filterOption={filterOptionFactory(value)}
        defaultActiveFirstOption={false}
      >
        <Input
          tabIndex="1"
          suffix={<Icon type="search" className="certain-category-icon" />}
        />
      </AutoComplete>
    </div>
  );
}

export default SearchContainer;
