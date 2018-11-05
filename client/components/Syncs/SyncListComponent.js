import React from "react";
import { List, Icon, Tooltip, Avatar } from "antd";
import { SyncIcon } from "./SyncLink";
import moment from "moment";
import TypeIcon from "../NewTypeIcon";
import _ from "lodash"

const Description = item => {
  switch (item.status) {
    case "pending":
      return "This synchronization event is still ongoing";
    case "failed":
      return "There was an error during this synchronizaiton process";
  }
  return `Succesfully synchronized ${item.resources.length} data set(s)`;
}

const SyncSublistComponent = (resources) => {
  console.log(resources)
  return (
    <List
      dataSource={resources}
      renderItem={item => {
        console.log({item})
        return (
        <List.Item key={item.searchID}>
          <div>{item.searchID}</div>
        </List.Item>
      )}}
    />
  );
}

const SyncListComponent = ({ pending, data, error }) => {
  console.log({ pending, data, error });
  return (
    <div className="syncs-list-container">
      <div className="syncs-list">
        {data &&
          <List
            dataSource={data}
            renderItem={item => (
              <List.Item key={item["@id"]}>
                <List.Item.Meta
                  avatar={<Avatar><SyncIcon status={item.status} /></Avatar>}
                  title={moment(item["_createdAt"]).fromNow()}
                  description={
                    <div>
                    {Description(item)}
                    {/* {SyncSublistComponent(item)} */}
                    </div>
                    }
                />
                <div>
                {SyncSublistComponent(item.resources)}
                <ul className="sync-item-content">
                  {_.chain(item.resources).map("resourceType").uniq().value().map(resourceType => {
                    return <li className="sync-type"><TypeIcon type={resourceType.type} /></li>
                  })}
                </ul>
                </div>
              </List.Item>
            )}
          >
          </List>
        }
      </div>
    </div>
  )
};

export default SyncListComponent;
