import React from "react";
import { connect } from "react-redux";
import { getProp } from "@libs/utils";
import TypeIcon from "../../NewTypeIcon";
import InspectLink from "../../Cards/Cell/InspectLink";
import fetchProtectedData from "../../../libs/fetchProtectedData";
import { Tag, Icon } from "antd";
import FontAwesome from "react-fontawesome";

const ProvLinkComponent = ({ instance , status, searchId, name, type }) => {
  const isPending = status === "pending";
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
    <InspectLink id={searchId} className="prov-link default">
      {type && <TypeIcon type={type}/>} <Icon type={isPending ? "loading" : "link"} theme="outlined" /><span>{getProp(instance, "cellName.label")}</span>{!isPending && studyTypeTag}
    </InspectLink>
  )
}


class ProvLinkContainer extends React.PureComponent {
  state = { status: "pending", instance: null }
  componentDidMount () {
    this.fetchEntity()
  }
  componentDidUpdate (nextProps) {
    if (nextProps.searchId !== this.props.searchId) {
      return this.fetchEntity();
    }
  }
  async fetchEntity() {
    const { instancesURL, token, searchId } = this.props;
    let instance = await fetchProtectedData.asJSON(instancesURL + "/instances/" + searchId, token)
    this.setState({ instance, status: "fulfilled" });
  }
  render() {
    const { instance, status } = this.state;
    const { searchId, name, type, renderItem } = this.props;
    if (renderItem) {
      return renderItem({ instance, status, searchId, name, type });
    }
    return ProvLinkComponent({ instance, status, searchId, name, type })
  }
}

function mapStateToProps({ config, auth }) {
  return {
    token: auth.token,
    instancesURL: config.elasticSearchAPI
  };
}

export default connect(mapStateToProps)(ProvLinkContainer);
