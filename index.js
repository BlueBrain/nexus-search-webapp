import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import { Route, Switch, IndexRoute } from "react-router";
import { ConnectedRouter } from 'connected-react-router'
import App from "./src/components/App";
import Home from "./src/components/Home";
import Details from "./src/components/Details";
import store from "./src/store";
import history from "./src/libs/history";

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App>
          <Switch>
            <Route exact={true} path="/" component={Home} />
            <Route path="/docs/:id" component={Details} />
          </Switch>
        </App>
      </ConnectedRouter>
    </Provider>
  </AppContainer>,
  document.getElementById("explorer-app")
);
