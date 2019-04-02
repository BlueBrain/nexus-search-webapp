import * as React from 'react';
import './Toolbar.less';

interface ToolbarProps {
  children: React.ReactNode;
}

const Toolbar: React.FunctionComponent<ToolbarProps> = props => {
  const { children } = props;

  return <div className="toolbar-container">{children}</div>;
};

export default Toolbar;
