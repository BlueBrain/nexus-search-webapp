import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import App from "./components/App";
import store from "./store";
import history from "./libs/history";

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App history={history}/>
      </Provider>
    </AppContainer>,
    document.getElementById("explorer-app")
  );
};

render ();

if (module.hot) {
  module.hot.accept('./App', () => {
    render()
  })
}