import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import oauth from 'axios-oauth-client'
import tokenProvider from 'axios-token-interceptor'
import VueAxios from 'vue-axios'
import myStore from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueNativeSock from 'vue-native-websocket'
import router from './router'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(myStore);

//axios.defaults.baseURL = "http://localhost:9000"

const getOwnerCredentials = oauth.client(axios.create(), {
  url: 'api/auth/oauth',
  grant_type: 'password',
  client_id: 'terminal-app',
  client_secret: 'secret',
  username: 'jp',
  password: '12345',
  scope: 'global'
});

axios.interceptors.request.use(
  oauth.interceptor(tokenProvider, getOwnerCredentials)
)

axios.defaults.timeout = 10 * 1000; // 10 sec

Vue.use(VueAxios, axios);

Vue.use(VueNativeSock, 'ws://localhost:5100/ws', {
  format: 'json',
  //connectManually: true,
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !myStore.Store.reactive.hasSession) next({ name: 'Login' })
  else next()
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
