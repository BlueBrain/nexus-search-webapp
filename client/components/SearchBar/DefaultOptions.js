import React from "react";
import { AutoComplete } from "antd";

const Option = AutoComplete.Option;

function DefaultOptions({ value }) {
  return (
    <Option
      key={"all"}
      value={"all"}
    >
      Find results for "{value}"
    </Option>
  );
}

export default DefaultOptions;
