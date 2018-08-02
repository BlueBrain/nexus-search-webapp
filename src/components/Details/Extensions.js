import React, { Fragment } from "react";
import { Tabs, Icon } from "antd";

const TabPane = Tabs.TabPane;

const Extensions = props => {

  return (
    <div>
      <Tabs
          defaultActiveKey="1"
          tabPosition={"left"}
          style={{ height: 300 }}
        >
          <TabPane tab={<span><Icon type="area-chart" />Analysis</span>} key="1">Content of tab 1</TabPane>
          <TabPane tab={<span><Icon type="like-o" />Verification</span>} key="2">Content of tab 2</TabPane>
          <TabPane tab={<span><Icon type="coffee" />Awesome</span>} key="3">Content of tab 3</TabPane>
        </Tabs>
    </div>
  );
}

export default Extensions;