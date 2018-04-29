<template>
<el-container v-loading="!this.status.online" element-loading-text="Connecting to server ...">
  <el-header height="45px">
    <ul>
        <li @click="openTheme()" class="button"><icon name="file"></icon> Open ...</li>
        <li @click="saveTheme()" class="button"><icon name="save"></icon> Save ...</li>
        <li @click="upload()" class="button"><icon name="upload"></icon> Upload</li>
        <li @click="addSound()" class="button"><icon name="plus"></icon> Add Sound</li>
        <li><el-input size="mini" v-model="filter" placeholder="Filter ..."><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input></li>
    </ul>
  </el-header>
  <el-main class="main">
    <el-collapse>
      <el-collapse-item v-for="(category, name) in categories" :key="name" :title="name">
        <Sound :sound=sound v-for="sound in category" :key="sound.id"/>
      </el-collapse-item>
    </el-collapse>
  </el-main>
</el-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Sound from './Sound'

  export default {
    name: 'sound-list',
    components: {
      Sound
    },

    data () {
      return {
        filter: '',
        scrollDown: false
      }
    },

    computed: {
      ...mapGetters({
        sounds: 'allSounds',
        status: 'status'
      }),

      categories () {
        let categories = {}

        for (let sound of this.filteredSounds) {
          if (!(sound.category in categories)) {
            categories[sound.category] = []
          }
          categories[sound.category].push(sound)
        }

        console.log(categories)

        return categories
      },

      filteredSounds () {
        return this.sounds.filter(sound => {
          return sound.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
        })
      }
    },

    methods: {
      ...mapActions([
        'play',
        'pause',
        'upload'
      ]),

      upload () {
        console.log(JSON.parse(JSON.stringify(this.$store.getters.theme)))
        this.$api.uploadTheme(JSON.parse(JSON.stringify(this.$store.getters.theme)))
          .then(() => {
            this.$message({
              message: 'Succesfully uploaded theme.',
              type: 'success'
            })
          })
          .catch((error, bla) => {
            console.log(error.response)
            this.$message({
              message: 'Error uploading theme: ' + error.response.data.message,
              type: 'error'
            })
          })
      },

      addSound () {
        this.$store.dispatch('addSound')
        this.scrollDown = true
      },

      openTheme () {
        let path = this.$electron.remote.dialog.showOpenDialog({
          title: 'Open Theme',
          filters: [
            {name: 'Theme File', extensions: ['json', 'theme']}
          ]
        })

        if (path !== undefined) {
          let content = this.$fs.readFileSync(path[0])
          this.$store.commit('UPDATE_THEME', JSON.parse(content))
        }
      },

      saveTheme () {
        let path = this.$electron.remote.dialog.showSaveDialog({
          title: 'Save Theme',
          filters: [
            {name: 'Theme File', extensions: ['json', 'theme']}
          ]
        })

        console.log('Saving to path {}', path)
        if (path !== undefined) {
          this.$fs.writeFileSync(path, JSON.stringify(this.$store.getters.theme))
        }
      }
    },

    updated () {
      if (this.scrollDown === true) {
        const main = this.$el.querySelector('.main')
        main.scrollTop = main.scrollHeight
        this.scrollDown = false
      }
    }
  }
</script>

<style>
  header {
    border-bottom: solid 1px #e6e6e6;
    position: fixed;
    width: 100%;
    background-color: #FFFFFF;
    z-index: 1;
  }

  header li {
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
    transition: border-color .3s,background-color .3s,color .3s;
    padding: 10px;
  }

  header .button:hover {
    background-color: #ecf5ff;
  }

  header li svg {
    margin-right: 10px;
  }

  .main {
    margin-top: 50px;
    height: calc(100vh - 50px);
    overflow-y: auto;
    margin-bottom: 20px;
  }
</style>
