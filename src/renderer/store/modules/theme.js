import Vue from 'vue'
import APIService from '../../api'
import UserConfig from '../../user_config'

const state = {
  theme: {
    name: '',
    sounds: []
  },
  status: {
    online: false,
    playing: false,
    theme_loaded: false,
    sounds_playing: []
  },
  log: '',
  library: [],

  appConfig: {
    localServer: true,
    remoteServerAddress: '',
    remoteServerToken: '',
    soundLibraryPath: ''
  },

  index: 0
}

const FUNCTION_DEFAULT = {
  Volume: {
    value: [1.0, 1.0]
  },

  Loop: {
    times: [0, 0]
  },

  Frequency: {
    value: [1.0, 1.0]
  },

  Delay: {
    value: [0, 0]
  },

  Repeat: {
    value: [1, 1]
  },

  LowPass: {
    cutoff: [5000, 5000],
    resonance: [1.0, 1.0]
  },

  Fader: {
    fade_in_length: [0.0, 0.0],
    fade_out_length: [1.0, 1.0]
  },

  Echo: {
    distance: [0, 0]
  },

  Reverb: {
    dry_level: [0.0, 0.0],
    room: [-10000.0, -10000.0],
    room_lf: [-10000.0, -10000.0],
    room_hf: [-10000.0, -10000.0],
    decay_time: [1.0, 1.0],
    decay_hf_ratio: [0.5, 0.5],
    reflections_level: [-10000.0, -10000.0],
    reflections_delay: [0.02, 0.02],
    reverb_level: [0.0, 0.0],
    reverb_delay: [0.04, 0.04],
    diffusion: [100.0, 100.0],
    density: [100.0, 100.0],
    hf_reference: [5000.0, 5000.0],
    lf_reference: [250.0, 250.0]
  }
}

function getFunctionData (funcName) {
  return JSON.parse(JSON.stringify(FUNCTION_DEFAULT[funcName]))
}

const mutations = {
  ADD_SOUND (state, sound) {
    state.theme.sounds.push(sound)
    state.index++
  },

  ADD_FUNCTION (state, [ id, funcType, funcName ]) {
    let sound = state.theme.sounds.find(sound => sound.id === id)

    Vue.set(sound.funcs[funcType], funcName, getFunctionData(funcName))
  },

  ADD_FUNCTION_WITH_PARAMS (state, [ id, funcType, funcName, params ]) {
    let sound = state.theme.sounds.find(sound => sound.id === id)

    Vue.set(sound.funcs[funcType], funcName, params)
  },

  REMOVE_FUNCTION (state, [ id, funcType, funcName ]) {
    let sound = state.theme.sounds.find(sound => sound.id === id)

    Vue.delete(sound.funcs[funcType], funcName)
  },

  DELETE_SOUND (state, id) {
    state.theme.sounds = state.theme.sounds.filter(sound => sound.id !== id)
  },

  UPDATE_SOUND (state, sound) {
    let index = state.theme.sounds.findIndex(s => s.id === sound.id)
    Vue.set(state.theme.sounds, index, sound)
  },

  SET_SOUND_ENABLED (state, [ id, flag ]) {
    let sound = state.theme.sounds.find(sound => sound.id === id)
    sound.is_disabled = !flag
  },

  SET_SOUND_NAME (state, [ id, name ]) {
    let sound = state.theme.sounds.find(sound => sound.id === id)
    sound.name = name
  },

  UPDATE_THEME (state, theme) {
    state.index = 0

    for (let sound of theme.sounds) {
      sound.id = state.index++

      // Be backwards compatible to model changes
      if (!('category' in sound)) {
        console.log('Add Category!!!!!!!!!!!!!!!!!!!!!!!!!')
        sound.category = 'General'
      }
    }

    state.theme = theme
  },

  SET_FUNC_VALUE (state, [ id, funcType, funcName, valueName, value ]) {
    let sound = state.theme.sounds.find(sound => sound.id === id)
    sound.funcs[funcType][funcName][valueName] = value
  },

  UPDATE_STATUS (state, status) {
    state.status = status
  },

  ADD_LOG_OUTPUT (state, text) {
    console.log('LOGGING: ' + text)
    state.log += text
  },

  UPDATE_SOUND_LIBRARY (state, sounds) {
    state.library = sounds
  },

  UPDATE_LOCAL_SERVER (state, flag) {
    state.appConfig.localServer = flag
    UserConfig.save()
  },

  UPDATE_REMOTE_SERVER_ADDRESS (state, address) {
    state.appConfig.remoteServerAddress = address
    UserConfig.save()
  },

  UPDATE_REMOTE_SERVER_TOKEN (state, token) {
    state.appConfig.remoteServerToken = token
    UserConfig.save()
  },

  UPDATE_SOUND_LIBRARY_PATH (state, path) {
    state.appConfig.soundLibraryPath = path
    UserConfig.save()
  },

  UPDATE_APP_CONFIG (state, config) {
    state.appConfig = config
  }
}

const actions = {
  addSound ({commit, state}) {
    const sound = {
      id: state.index,
      name: 'New Sound ' + state.index,
      file_path: '',
      needs_trigger: false,
      is_disabled: false,
      category: 'General',
      funcs: {
        start: {},
        update: {},
        finish: {}
      }
    }
    commit('ADD_SOUND', sound)
  },

  togglePlay ({commit, state}) {
    console.log(state.status)
    if (state.status.playing === true) {
      console.log('DO THE PAUSE')
      APIService.pause()
    } else {
      console.log('DO THE PLAY')
      APIService.play()
    }
  },

  dump ({commit, state}) {
    console.log(JSON.stringify(state.theme))
  },

  updateStatus ({commit, state}) {
    APIService.getStatus()
      .then(function (response) {
        response.data.online = true
        commit('UPDATE_STATUS', response.data)
      })
      .catch(function () {
        commit('UPDATE_STATUS', {
          online: false,
          playing: false,
          theme_loaded: false
        })
      })
  },

  upload ({commit, state}) {
    APIService.uploadTheme(state.theme)
      .then(function () {
      })
      .catch(function () {
      })
  },

  trigger ({commit, state}, soundName) {
    APIService.trigger(soundName)
      .then(function () {
      })
      .catch(function () {
      })
  },

  getSoundLibrary ({commit, state}) {
    APIService.getSoundLibrary()
      .then(function (response) {
        console.log(response)
        commit('UPDATE_SOUND_LIBRARY', response.data.sounds)
      })
      .catch(function () {
      })
  }
}

const getters = {
  allSounds: state => state.theme.sounds,
  status: state => state.status,
  theme: state => state.theme,
  soundsPlaying: state => state.status.sounds_playing,
  log: state => state.log,
  soundLibrary: state => state.library,
  localServer: state => state.appConfig.localServer,
  remoteServerAddress: state => state.appConfig.remoteServerAddress,
  remoteServerToken: state => state.appConfig.remoteServerToken,
  soundLibraryPath: state => state.appConfig.soundLibraryPath,
  appConfig: state => state.appConfig,

  isSoundEnabled: (state) => (id) => {
    let sound = state.theme.sounds.find(sound => sound.id === id)

    if (sound) {
      return !sound.is_disabled
    }
  },

  soundName: (state) => (id) => {
    let sound = state.theme.sounds.find(sound => sound.id === id)

    if (sound) {
      return sound.name
    }
  },

  funcValue: (state) => (id, funcType, funcName, valueName) => {
    let sound = state.theme.sounds.find(sound => sound.id === id)

    return sound.funcs[funcType][funcName][valueName]
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
