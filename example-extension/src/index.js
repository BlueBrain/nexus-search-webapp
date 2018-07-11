import Vue from 'vue'
import App from './components/App.vue'

export default element => {
  console.log(`Welcome to an example extension! ${element}`)
  new Vue({
    el: element,
    render: h => h(App)
  });
}
