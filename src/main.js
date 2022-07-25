import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/index.less";
import "./socket-io/index.js";
import "./utils/vue.prototype";
import Icon from "vue-svg-icon/Icon.vue";
import Message from "@/components/Message/index.js";
import "babel-polyfill";
Vue.use(Message.register);
Vue.component("icon", Icon);
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
Vue.use(VueDirectiveImagePreviewer,{
  zIndex: 9999,
}) 
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
