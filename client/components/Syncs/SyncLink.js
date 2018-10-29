import React from "react";
import { Icon } from "antd";
import { Link } from "react-router-dom";

const SyncLink = () => (
    <div className="syncs-block">
      <Link
        to={"/syncs"}>
        <Icon type="sync" />
        {" "} Syncs
      </Link>
    </div>

);

export default SyncLink;
