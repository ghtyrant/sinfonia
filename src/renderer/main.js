import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import VueElectron from 'vue-electron'
import Electron from 'electron'
import VueAwesome from 'vue-awesome'
import fs from 'fs'
import 'element-theme-chalk/lib/index.css'
import ChildProcess from 'child_process'

import router from './router'
import store from './store'
import App from './App'
import APIService from './api'
import UserConfig from './user_config'

Vue.use(Element, {locale})
Vue.use(Vuex)
Vue.use(VueElectron)
Vue.component('icon', VueAwesome)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.http = Vue.prototype.$http = axios.create({
  baseURL: 'http://localhost:9090'
})
Vue.api = Vue.prototype.$api = APIService
Vue.child_process = Vue.prototype.$child_process = ChildProcess
Vue.config.productionTip = false
Vue.prototype.$fs = fs

function startBackendProcess (accessToken) {
  console.log('Launching exe!')

  let executablePath = 'sinfonia_server.exe'

  Electron.remote.path = require('path')
  let soundLibraryPath = store.getters.soundLibraryPath

  if (!soundLibraryPath) {
    soundLibraryPath = '.'
  }

  let parameters = ['--access-token', accessToken, '--host', '127.0.0.1:9090', '--sound-library', soundLibraryPath]
  console.log(parameters)

  let backend = Vue.child_process.spawn(executablePath, parameters)
  backend.on('error', (err) => {
    store.commit('ADD_LOG_OUTPUT', 'Error in backend process: ' + err)
  })

  backend.stdout.on('data', (data) => {
    store.commit('ADD_LOG_OUTPUT', String.fromCharCode.apply(null, data))
  })

  backend.stderr.on('data', (data) => {
    store.commit('ADD_LOG_OUTPUT', String.fromCharCode.apply(null, data))
  })

  return backend
}

function createBackendControl (http) {
  return {
    disabled: false,
    backend: null,
    http: http,

    stop () {
      this.backend.kill()
      this.disabled = true
    },

    start () {
      let accessToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      this.http.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
      this.backend = startBackendProcess(accessToken)

      this.backend.on('close', (returnCode) => {
        if (!this.disabled) {
          startBackendProcess(accessToken)
        }
      })
    },

    restart () {
      this.stop()
      this.start()
    }
  }
}

UserConfig.load()

Vue.http.defaults.baseURL = 'http://127.0.0.1:9090/'

if (store.getters.localServer) {
  Vue.backend = Vue.prototype.$backend = createBackendControl(Vue.http)
  Vue.backend.start()
} else {
  Vue.backend = Vue.prototype.$backend = createBackendControl(Vue.http)
  Vue.http.defaults.baseURL = store.getters.remoteServerAddress
  Vue.http.defaults.headers.common['Authorization'] = 'Bearer ' + store.getters.remoteServerToken
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  router,
  template: '<App/>'
}).$mount('#app')
