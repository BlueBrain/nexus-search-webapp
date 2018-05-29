import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "react-router-redux";
import App from "./src/components/App";
import Home from "./src/components/Home";
import store from "./src/store";
import history from "./src/libs/history";

ReactDOM.render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App>
            <Switch>
              <Route path="/*" component={Home} />
            </Switch>
          </App>
        </ConnectedRouter>
      </Provider>,
  document.getElementById("explorer-app")
);
