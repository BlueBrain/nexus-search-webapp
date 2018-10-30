import React from "react";
import { Icon, Tooltip } from "antd";
import { Link } from "react-router-dom";

export const SyncIcon = ({ status }) => {
  switch (status) {
    case "pending":
      return (
        <Tooltip title="Synchronizing Data...">
          <Icon type="sync" spin />
        </Tooltip>
      )
    case "failed":
      return (
        <Tooltip title="There was an error synchronizing data!">
          <Icon type="exclamation-circle" style={{ color: "#f5b5e8" }} />
        </Tooltip>
      );
  }
  return (
    <Tooltip title="Data Synchronized">
      <Icon type="check-circle" style={{ color: "#45c7f4" }}/>
    </Tooltip>
  );
}

const SyncLink = ({ status = "ok" }) => (
  <div className="syncs-block">
    <Link
      to={"/syncs"}>
      <SyncIcon status={status} />
      {" "}
    </Link>
  </div>
);

export default SyncLink;
