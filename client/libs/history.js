import { createBrowserHistory } from "history";

const APP_PATH = window.BASE_PATH.startsWith("$") ? "" : window.BASE_PATH + "/";
const history = createBrowserHistory({
  basename: APP_PATH
});

export default history;
