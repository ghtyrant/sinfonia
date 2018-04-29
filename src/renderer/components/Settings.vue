<template>
<el-container>
  <el-main class="settings-main">
    <h1>Settings</h1>
    <el-form>
      <el-form-item label="Audio Output">
        <el-select v-model="driver" @focus="loadDrivers">
          <el-option v-for="d in driverList" :key="d[0]" :label="d[1]" :value="d[0]"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Built-In Sound Server">
        <el-switch inactive-text="Disabled" active-text="Enabled" v-model="localServer" @change="toggleLocalServer"></el-switch>
      </el-form-item>

      <el-form-item label="Sound Library (changing this restarts the server)" v-if="localServer">
        <el-input v-model="soundLibraryPath" placeholder="" readonly></el-input> <el-button @click="selectSoundLibrary"><icon name="folder-open"></icon></el-button>
      </el-form-item>

      <el-form-item label="Remote Server Address" v-if="!localServer">
        <el-input v-model="remoteServerAddress" placeholder="http://192.168.0.1:9090"></el-input>
      </el-form-item>

      <el-form-item label="Access Token" v-if="!localServer">
        <el-input v-model="remoteServerToken" placeholder="Token"></el-input>
      </el-form-item>

      <el-form-item v-if="!localServer">
        <el-button type="primary" v-loading="testingRemoteConnection" @click="testRemoteConnection">Test &amp; Save</el-button>
      </el-form-item>
    </el-form>

    <div v-if="localServer">
      <h1>Log Output</h1>
      <pre>{{ this.log }}</pre>
    </div>
  </el-main>
</el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'settings',

  data () {
    return {
      driverList: [],
      currentDriver: null,
      testingRemoteConnection: false
    }
  },

  computed: {
    ...mapGetters({
      log: 'log'
    }),

    soundLibraryPath: {
      get () {
        return this.$store.getters.soundLibraryPath
      },

      set (path) {
        this.$store.commit('UPDATE_SOUND_LIBRARY_PATH', path)
      }
    },

    localServer: {
      get () {
        return this.$store.getters.localServer
      },

      set (flag) {
        this.$store.commit('UPDATE_LOCAL_SERVER', flag)
      }
    },

    remoteServerAddress: {
      get () {
        return this.$store.getters.remoteServerAddress
      },

      set (value) {
        this.$store.commit('UPDATE_REMOTE_SERVER_ADDRESS', value)
      }
    },

    remoteServerToken: {
      get () {
        return this.$store.getters.remoteServerToken
      },

      set (value) {
        this.$store.commit('UPDATE_REMOTE_SERVER_TOKEN', value)
      }
    },

    driver: {
      get () {
        if (this.currentDriver === null) {
          // No driver set
          // First, load the list of drivers
          this.$api.getDriverList()
            .then((response) => {
              this.driverList = response.data.drivers

              // And then load the current driver
              this.$api.getDriver()
                .then((response) => {
                  this.currentDriver = response.data.id
                })
                .catch(function (error) {
                  console.log(error)
                })
            })
            .catch(function (error) {
              console.log(error)
            })
        }

        return this.currentDriver
      },

      set (value) {
        this.currentDriver = value
        this.$api.setDriver(value)
      }
    }
  },

  methods: {
    loadDrivers () {
      this.$api.getDriverList()
        .then((response) => {
          console.log('Driver List:')
          console.log(response.data.drivers)
          this.driverList = response.data.drivers
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    toggleLocalServer (value) {
      if (value === false) {
        console.log('Killing backend process ...')
        this.$backend.stop()
      } else {
        this.$backend.start()
      }
    },

    testRemoteConnection () {
      this.testingRemoteConnection = true

      axios.get(this.remoteServerAddress + '/status', {
        headers: {'Authorization': 'Bearer ' + this.remoteServerToken}
      })
        .then((response) => {
          this.testingRemoteConnection = false

          this.$http.defaults.baseURL = this.remoteServerAddress
          this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + this.remoteServerToken

          this.$message({
            message: 'Connection established!',
            type: 'success'
          })
        })
        .catch((error) => {
          this.testingRemoteConnection = false
          this.$message({
            message: 'Failed to connect to remote server: ' + error,
            type: 'error'
          })
        })
    },

    selectSoundLibrary () {
      let path = this.$electron.remote.dialog.showOpenDialog({
        title: 'Select Sound Library',
        properties: ['openDirectory']
      })

      if (path !== undefined) {
        this.soundLibraryPath = path[0]
        this.$backend.restart()
      }
    }
  }
}
</script>

<style>
  h1 {
    margin-bottom: 20px;
  }

  pre {
    white-space: pre-wrap;
    background-color: #eeeeee;
    padding: 2px;
    height: 500px;
    overflow-y: auto;
  }

  .settings-main {
    height: 100vh;
    overflow-y: auto;
  }
</style>

