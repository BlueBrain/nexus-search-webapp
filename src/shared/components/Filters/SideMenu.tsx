import * as React from 'react';
import { Switch, Drawer } from 'antd';

export interface SideMenuProps {
  children?: React.ReactChild;
}

const SideMenu: React.FunctionComponent<SideMenuProps> = ({ children }) => {
  const [visible, setVisible] = React.useState(true);
  return (
    <>
      <Switch
        defaultChecked
        size="small"
        onChange={() => setVisible(!visible)}
      />
      <Drawer
        title="Filters"
        mask={false}
        placement={'left'}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        {children}
      </Drawer>
    </>
  );
};

export default SideMenu;
