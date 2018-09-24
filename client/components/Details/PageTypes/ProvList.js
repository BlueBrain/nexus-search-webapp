import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { getProp } from "@libs/utils";
import { List, Tag, Skeleton } from "antd";
import TypeIcon from "../../NewTypeIcon";
import ProvLink from "./ProvLink";
import InspectLink from "../../Cards/Cell/InspectLink";
import FontAwesome from "react-fontawesome";

const descriptionFromType = (instance, type) => {
  switch (type) {
    default:
      return <div>{getProp(instance, "brainLocation.brainRegion")}</div>;
  }
};

const ProvListComponent = ({ provList, title }) => {
  return (
    <div className="prov-list">
      <h3>{title}</h3>
      <List
        itemLayout="horizontal"
        dataSource={provList}
        renderItem={item => (
          <ProvLink
            key={item.searchId + "-prov-list-element"}
            {...item}
            renderItem={({ instance, status, searchId, name, type }) => {
              console.log({type})
              const studyTypeTag =
                getProp(instance, "studyType.name") === "In Silico" ? (
                  <Tag color="#00c4ff">
                    <FontAwesome name={"microchip"} /> In Silico
                  </Tag>
                ) : (
                  <Tag color="#90eac3">
                    <FontAwesome name={"flask"} /> Experimental
                  </Tag>
                );
              return (
                <List.Item>
                  <Skeleton loading={status === "pending"} active avatar>
                    <List.Item.Meta
                      title={
                        <InspectLink id={getProp(instance, "searchID")}>
                          <div className="prov-link">
                          <TypeIcon type={type} /> {getProp(instance, "cellName.label")} {studyTypeTag}
                          </div>
                        </InspectLink>
                      }
                      description={descriptionFromType(instance, type)}
                    />
                  </Skeleton>
                </List.Item>
              );
            }}
          />
        )}
      />
    </div>
  );
};

class ProvListContainer extends PureComponent {
  render() {
    return ProvListComponent({ ...this.props });
  }
}

function mapStateToProps({}) {
  return {};
}

export default connect(mapStateToProps)(ProvListContainer);
