import * as React from 'react';
import { Switch, Drawer, Button } from 'antd';

export interface SideMenuProps {
  children?: React.ReactChild;
}

const SideMenu: React.FunctionComponent<SideMenuProps> = ({ children }) => {
  const [visible, setVisible] = React.useState(false);
  const ToggleVisibility = () => {
    setVisible(!visible);
  };
  return (
    <>
      <Button icon="menu-unfold" size="small" onClick={ToggleVisibility} />
      <Drawer
        title="Filters"
        mask={false}
        placement={'left'}
        onClose={ToggleVisibility}
        visible={visible}
      >
        {children}
      </Drawer>
    </>
  );
};

export default SideMenu;
