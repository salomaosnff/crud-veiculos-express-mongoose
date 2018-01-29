import Vue from 'vue'
import Vuetify from 'vuetify'

import App from './App.vue'

Vue.use(Vuetify, {
  theme: {
    primary: '#009688',
    accent: '#009688',
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
