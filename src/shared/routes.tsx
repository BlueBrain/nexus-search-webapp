import * as React from 'react';
import { RouteProps, match } from 'react-router-dom';
import Home from './views/Home';
import { ThunkAction } from './store';
import { RootState } from './store/reducers';

export interface RouteWithData extends RouteProps {
  loadData?(state: RootState, match: match | null): ThunkAction;
}
const routes: RouteWithData[] = [
  {
    path: '/',
    exact: true,
    component: Home,
    // loadData: () => fetchOrgs(),
  },
];

export default routes;
