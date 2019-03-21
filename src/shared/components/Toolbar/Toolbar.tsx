import * as React from 'react';
import { Dropdown, Menu, Icon, Avatar, Button, Tooltip, Popover } from 'antd';
import { Identity } from '@bbp/nexus-sdk/lib/ACL/types';
import { getUserList, getOrderedPermissions } from '../../utils';
import RenameableItem from '../Renameable';

import './Toolbar.less';
import AddMemberForm from './AddMemberForm';

interface ToolbarData {
  menuTitle: string;
  menuIcon: string;
}
const getToolbarData = (activePermission: Identity['@type']): ToolbarData => {
  switch (activePermission) {
    case 'Anonymous':
      return { menuTitle: 'Public', menuIcon: 'global' };
    case 'Authenticated':
      return { menuTitle: 'Realm', menuIcon: 'crown' };
    case 'Group':
      return { menuTitle: 'Group', menuIcon: 'team' };
    case 'User':
      return { menuTitle: 'Private', menuIcon: 'lock' };
    default:
      return { menuTitle: 'Unknown', menuIcon: 'warning' };
  }
};

interface ToolbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => any;
  identities: Identity[];
  onNewPermissionSelected(identity: Identity['@type']): void;
  onNewMemberAdded(username: string): void;
}
const Toolbar: React.FunctionComponent<ToolbarProps> = props => {
  // the check icon will belong to the active permission
  const check = <Icon type="check" style={{ fontWeight: 'bold' }} />;
  const orderedIdentities = getOrderedPermissions(props.identities);
  const toolbarData = getToolbarData(orderedIdentities[0]);

  // List of possible permissions to be set for a project
  const menu = (
    <Menu className="Toolbar-permission-menu">
      <h3 className="title">Change permissions</h3>
      <Menu.Divider />
      <Menu.Item key="0" onClick={() => props.onNewPermissionSelected('User')}>
        <div className="permission-item">
          <Icon type="lock" style={{ color: 'red' }} />
          <span className="permission-name">Private</span>
          {orderedIdentities[0] === 'User' && check}
        </div>
        <p>Only project members can access this project.</p>
      </Menu.Item>
      <Menu.Item
        key="1"
        onClick={() => props.onNewPermissionSelected('Authenticated')}
      >
        <div className="permission-item">
          <Icon type="bank" />
          <span className="permission-name">Realm</span>
          {orderedIdentities[0] === 'Authenticated' && check}
        </div>
        <p>
          Anyone authenticated with the same realm can see and edit the project.
        </p>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => props.onNewPermissionSelected('Group')}>
        <div className="permission-item">
          <Icon type="team" />
          <span className="permission-name">Group</span>
          {orderedIdentities[0] === 'Group' && check}
        </div>
        <p>All members of the group can see and edit the project.</p>
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => props.onNewPermissionSelected('Anonymous')}
      >
        <div className="permission-item">
          <Icon type="global" style={{ color: 'green' }} />
          <span className="permission-name">Public</span>
          {orderedIdentities[0] === 'Anonymous' && check}
        </div>
        <p>
          Anyone on the internet can see this project. Only project members can
          edit it.
        </p>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="Toolbar">
      <RenameableItem
        defaultValue={props.projectName}
        onChange={props.onProjectNameChange}
      />
      <span className="divider" />
      <Dropdown overlay={menu} trigger={['click']}>
        <Button type="primary" icon={toolbarData.menuIcon}>
          {toolbarData.menuTitle}
        </Button>
      </Dropdown>
      <span className="divider" />
      <div className="members">
        {getUserList(props.identities).map(user => (
          <Avatar key={user} style={{ color: 'black' }}>
            {user}
          </Avatar>
        ))}
      </div>
      <Tooltip placement="right" title="add a new member">
        <Popover
          content={<AddMemberForm onSubmit={props.onNewMemberAdded} />}
          trigger="click"
          title={<h3>Add a new member to this project</h3>}
        >
          <Button type="primary" shape="circle" icon="user-add" />
        </Popover>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
