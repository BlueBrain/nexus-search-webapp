import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import App from "./src/components/App";
import Home from "./src/components/Home";
import store from "./src/store";
import history from "./src/libs/history";

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App>
          <Switch>
            <Route path="/*" component={Home} />
          </Switch>
        </App>
      </ConnectedRouter>
    </Provider>
  </AppContainer>,
  document.getElementById("explorer-app")
);
