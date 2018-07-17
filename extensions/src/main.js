
import 'iview/dist/styles/iview.css';

import Vue from 'vue';
import iView from 'iview';
import locale from 'iview/dist/locale/en-US';

import App from './App.vue';

Vue.use(iView, { locale });

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
