import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

import axios from "axios";
import { AxiosManagerStatic, AxiosQueryInfo } from "./lib/index";

AxiosManagerStatic.addMiddleWear(
  new AxiosQueryInfo(metadata => console.log(metadata))
);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
