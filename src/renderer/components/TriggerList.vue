<template>
<el-container v-loading="!this.status.online" element-loading-text="Connecting to server ...">
  <el-main class="trigger-main">
    <el-input size="mini" v-model="filter" placeholder="Filter ..."><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>

    <div v-for="sound in filteredSounds" :key="sound.id" @click="trigger(sound.name)" class="trigger" :class="{ playing: isPlaying(sound.name) }">
      <span class="title">{{ sound.name }}</span>
    </div>
  </el-main>
</el-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'trigger-list',
    components: {
    },

    data () {
      return {
        filter: ''
      }
    },

    computed: {
      ...mapGetters({
        sounds: 'allSounds',
        status: 'status'
      }),

      filteredSounds () {
        return this.sounds.filter(sound => {
          return sound.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1 && sound.needs_trigger
        })
      }
    },

    methods: {
      trigger (name) {
        this.$api.trigger(name)
          .then(() => {
            this.$message({
              message: 'Triggered ' + name + '!',
              type: 'success'
            })
          })
          .catch(() => {
            this.$message({
              message: 'Failed to trigger ' + name + '!',
              type: 'error'
            })
          })
      },

      isPlaying (sound) {
        let soundsPlaying = this.$store.getters.soundsPlaying
        return soundsPlaying.includes(sound)
      }
    }
  }
</script>

<style>
  .trigger-main {
    height: 100vh;
    overflow-y: auto;
  }

  .trigger {
    width: 100px;
    height: 100px;
    display: inline-block;
    border: 1px solid #bbbbbb;
    margin: 10px;
    text-align: center;
    line-height: 90px;
    transition: border-color .3s,background-color .3s,color .3s;
    border-radius: 5px;
  }

  .trigger .title {
    vertical-align: middle;
    display: inline-block;
    line-height: normal;
  }

  .trigger:hover {
    cursor: pointer;
    background-color: #ecf5ff;
  }

  .playing {
    background-color: #e40000;
  }
</style>
