import React, { PureComponent } from "react";
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
    console.log(data);
    const Extensions = extensions.getByEntityId(entityId);
    extensions.setAuthToken(`Bearer ${token}`);
    return (
      <div>
      <Tabs
          defaultActiveKey={Extensions.length ? Extensions[0].attrs.name : null}
          tabPosition={"left"}
          style={{ minHeight: 300 }}
        >{
          Extensions.map(Extension => {
            console.log({Extension});
            return (
              <TabPane tab={<span><Icon type={Extension.attrs.iconType || "area-chart"} />{Extension.attrs.name}</span>} key={Extension.attrs.name}>
                <div ref={ref => this.initiateExtension(ref, Extension)}>
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

export default ExtensionsContainer;