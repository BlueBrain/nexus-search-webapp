import * as React from 'react';
import { AccessControl } from '@bbp/react-nexus';

export const resourcesWritePermissionsWrapper = (
  child: React.ReactNode,
  permissionPath: string
) => {
  const permissions = ['resources/write'];
  return React.createElement(AccessControl, {
    permissions,
    path: permissionPath,
    children: [child],
  });
};
