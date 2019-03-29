import { StaticRouterProps } from 'react-router';
import auth, { AuthState } from './auth';
import config, { ConfigState } from './config';
import nexus, { NexusState } from './nexus';
import uiSettingsReducer, { UISettingsState } from './ui-settings';

export interface RootState {
  auth: AuthState;
  config: ConfigState;
  nexus?: NexusState;
  router?: StaticRouterProps;
  uiSettings: UISettingsState;
}

export default {
  auth,
  config,
  nexus,
  uiSettings: uiSettingsReducer,
};
