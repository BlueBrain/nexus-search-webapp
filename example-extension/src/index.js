import Vue from "vue";
import App from "./components/App.vue";

export default class Extension {
  constructor(element, data) {
    this.element = element;
    this.data = data;
    console.log(`Welcome to an example extension! ${element}`);
  }

  show() {
    // do your stuff!
    this.component = new Vue({
      el: this.element,
      render: h =>
        h(App, {
          props: {
            msg: this.data
          }
        })
    });
  }
  destroy() {
    // remove your stuff!
    this.component = null;
  }
}
