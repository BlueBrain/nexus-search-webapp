import React from 'react'
import { Route } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import Routes from "./Routes";

const App = ({ history }) => (
  <ConnectedRouter history={history}>
    <Route component={Routes}/>
  </ConnectedRouter>
);

export default App;