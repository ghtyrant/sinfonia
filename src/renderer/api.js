import Vue from 'vue'

export default {
  play () {
    Vue.http.post('/play')
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  },

  pause () {
    Vue.http.post('/pause')
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  },

  getStatus () {
    return Vue.http.get('/status')
  },

  uploadTheme (theme) {
    let cleanedTheme = JSON.parse(JSON.stringify(theme))
    let allowedFields = ['name', 'file_path', 'funcs', 'needs_trigger', 'is_disabled']

    for (let sound of cleanedTheme.sounds) {
      for (let key of Object.keys(sound)) {
        console.log(typeof key)
        if (allowedFields.indexOf(key) === -1) {
          delete sound[key]
        }
      }
      console.log(sound)
    }

    return Vue.http.post('/theme', cleanedTheme)
  },

  trigger (soundName) {
    return Vue.http.post('/trigger', { name: soundName })
  },

  preview (soundName) {
    return Vue.http.post('/preview', { name: soundName })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  },

  getSoundLibrary () {
    return Vue.http.get('/library')
  },

  volume (value) {
    return Vue.http.post('/volume', { value: value })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  },

  getDriverList () {
    return Vue.http.get('/driver/list')
  },

  getDriver () {
    return Vue.http.get('/driver')
  },

  setDriver (value) {
    Vue.http.post('/driver', { id: value })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
