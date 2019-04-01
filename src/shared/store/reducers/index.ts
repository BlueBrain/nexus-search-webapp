import { StaticRouterProps } from 'react-router';
import auth, { AuthState } from './auth';
import config, { ConfigState } from './config';
import uiSettingsReducer, { UISettingsState } from './ui-settings';
import datasetsReducer, { DatasetsState } from './datasets';

export interface RootState {
  auth: AuthState;
  config: ConfigState;
  router?: StaticRouterProps;
  uiSettings: UISettingsState;
  datasets?: DatasetsState;
}

export default {
  auth,
  config,
  datasets: datasetsReducer,
  uiSettings: uiSettingsReducer,
};
