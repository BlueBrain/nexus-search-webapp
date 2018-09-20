import React, { PureComponent } from "react";
import { connect } from "react-redux";
import extensions from '@bbp/nexus-search-extensions';
import { Tabs, Icon } from "antd";

const TabPane = Tabs.TabPane;

class ExtensionsContainer extends PureComponent {
  extensions = []
  constructor(props) {
    super(props);
    this.viewContainer = React.createRef();

    this.viewContainer = null;

    this.setViewContainer = element => {
      this.viewContainer = element;
    };
  }
  initiateExtension (ref, Extension) {
    if (ref) {
      this.extensions.push(new Extension(ref));
    }
  }
  componentWillUnmount () {
    this.extensions.forEach(extension => extension.destroy());
  }
  render () {
    let { data, token } = this.props;
    const entityId = data["@id"];
    const Extensions = extensions.getByEntityId(entityId);
    extensions.setAuthToken(`Bearer ${token}`);
    return (
      <div>
      <Tabs
          defaultActiveKey={Extensions.length ? Extensions[0].attrs.name : null}
          tabPosition={"left"}
          style={{ minHeight: 300 }}
        >{
          Extensions.map((Extension, index) => {
            return (
              <TabPane key={index+"-extension"} tab={<span><Icon type={Extension.attrs.iconType || "area-chart"} />{Extension.attrs.name}</span>} key={Extension.attrs.name}>
                <div style={{padding: "1em"}} ref={ref => this.initiateExtension(ref, Extension)}>
                </div>
              </TabPane>
            );
          })
        }
        </Tabs>
    </div>
    );
  }
}


function mapStateToProps({ auth }) {
  return {
    token: auth.token
  }
}

export default connect(
  mapStateToProps
)(ExtensionsContainer);