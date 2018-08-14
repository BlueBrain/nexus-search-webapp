import React, { PureComponent } from "react";
import extensions from '@bbp/nexus-search-extensions-example';
import { Tabs, Icon } from "antd";

console.log({extensions});

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
    this.extensions.push(new Extension(ref));
  }
  componentWillUnmount () {
    this.extensions.forEach(extension => extension.destroy());
  }
  render () {
    let { data } = this.props;
    const entityId = data["@id"];
    let type = "eModel";
    const Extensions = extensions.getByEntityId(`https://domain/api/data/org/domain/${type}/ver/uuid`);
    console.log({ entityId });
    return (
      <div>
      <Tabs
          defaultActiveKey="1"
          tabPosition={"left"}
          style={{ height: 300 }}
        >{
          Extensions.map(Extension => {
            return (
              <TabPane tab={<span><Icon type="area-chart" />{Extension.attrs.name}</span>} key={Extension.attrs.name}>
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