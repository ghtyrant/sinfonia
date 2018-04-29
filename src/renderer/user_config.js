import { remote } from 'electron'
import store from './store'
import fs from 'fs'

export default {
  save () {
    let path = remote.app.getPath('userData') + '/config.json'
    fs.writeFileSync(path, JSON.stringify(store.getters.appConfig))
  },

  load () {
    let path = remote.app.getPath('userData') + '/config.json'
    if (fs.existsSync(path)) {
      let config = fs.readFileSync(path)
      store.commit('UPDATE_APP_CONFIG', JSON.parse(config))
    }
  }
}
