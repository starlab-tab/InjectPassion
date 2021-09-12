import Vue from 'vue'
import App from './App'
import surf from './utils/surf'
import uView from "uview-ui";

Vue.use(uView);

Vue.config.productionTip = false
Vue.prototype.$surf = surf

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
