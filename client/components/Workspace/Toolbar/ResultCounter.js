import React from "react";
import { Spin, Icon } from 'antd';

const spinIcon = <Icon type="loading" spin />;

const ResultCounter = ({ pending, resultCount }) => {
  return (
    <div>
      {pending && <span><Spin indicator={spinIcon} />{"   "}searching nexus</span>}
      {!pending && !!resultCount && <span>{resultCount} results found</span>}
    </div>
  );
};

export default ResultCounter;
