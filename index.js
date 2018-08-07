import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "react-redux";
import App from "./src/components/App";
import store from "./src/store";
import history from "./src/libs/history";
console.log(window.location);
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