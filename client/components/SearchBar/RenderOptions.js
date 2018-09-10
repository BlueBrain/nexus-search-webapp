import React from "react";
import { AutoComplete } from "antd";
import { guidGenerator } from "@libs/utils";

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

function renderTitle(title) {
  return <span>{title}</span>;
}

function RenderOptions(group) {
  return (
    <OptGroup
      key={group.key + guidGenerator()}
      label={renderTitle(group.title)}
    >
      {group.children.map(opt => {
        return (
          <Option
            key={opt.key + guidGenerator()}
            value={opt.key}
            grouptitle={group.title}
            title={opt.title}
            filterkey={opt.filterKey}
            selected={opt.selected}
          >
            {opt.title}
            <span style={{ float: "right" }} className="search-item-count">
              {opt.doc_count} entries
            </span>
          </Option>
        );
      })}
    </OptGroup>
  );
}

export default RenderOptions;
