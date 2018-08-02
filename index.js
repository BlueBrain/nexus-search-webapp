import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { Route } from "react-router";
import { ConnectedRouter } from 'connected-react-router'
import App from "./src/components/App";
import Routes from "./src/components/Routes";
import store from "./src/store";
import history from "./src/libs/history";

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Route component={Routes}/>
      </ConnectedRouter>
    </Provider>
  </AppContainer>,
  document.getElementById("explorer-app")
);
