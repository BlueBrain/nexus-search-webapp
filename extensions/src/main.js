
import 'iview/dist/styles/iview.css';

import Vue from 'vue';
import iView from 'iview';
import locale from 'iview/dist/locale/en-US';

import auth from './services/auth';
import App from './App.vue';

Vue.use(iView, { locale });
Vue.config.productionTip = false;

const app = new Vue({ render: h => h(App) });

auth.init().then(() => app.$mount('#app'));
