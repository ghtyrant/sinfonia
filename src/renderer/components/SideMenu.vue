<template>
<el-aside class="sidebar" width="200px">
  <el-menu default-active="1" class="full_height">
    <el-menu-item index="1" @click="showSoundEditor()">
      <icon name="music" class="icon"></icon>
      <span slot="title">Sound Editor</span>
    </el-menu-item>
    <el-menu-item index="2" @click="showTriggerList()">
      <icon name="toggle-on" class="icon"></icon>
      <span slot="title">Triggers</span>
    </el-menu-item>
    <el-menu-item index="3" @click="showSettings()">
      <icon name="cogs" class="icon"></icon>
      <span slot="title">Settings</span>
    </el-menu-item>
    <el-menu-item index="4" @click="showAbout()">
      <icon name="info" class="icon"></icon>
      <span slot="title">About</span>
    </el-menu-item>
  </el-menu>

  <div class="sound-control">
    <el-button v-if="!this.status.playing" round  @click="togglePlay()"><icon name="play"></icon></el-button>
    <el-button v-else  @click="togglePlay()" round><icon name="pause" round></icon></el-button>
    <el-slider :min="0.0" :max="1.0" :step="0.01" v-model="volume" @change="updateVolume"></el-slider>
  </div>
</el-aside>
</template>

<script>
  export default {
    data () {
      return {
        volume: 1.0
      }
    },

    computed: {
      status () {
        return this.$store.getters.status
      }
    },

    methods: {
      togglePlay () {
        this.$store.dispatch('togglePlay')
      },

      showTriggerList () {
        this.$router.push({ name: 'trigger-list' })
      },

      showSoundEditor () {
        this.$router.push({ name: 'sound-editor' })
      },

      showSettings () {
        this.$router.push({ name: 'settings' })
      },

      showAbout () {
        this.$router.push({ name: 'about' })
      },

      updateVolume (value) {
        this.$api.volume(value)
      }
    }
  }
</script>

<style>
  .sidebar {
    position: fixed;
    height: 100%;
  }

  .full_height {
    height: 100%;
  }

  .el-menu-item span {
    margin-left: 20px;
  }

  .sound-control {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
    margin-bottom: 20px;
    padding: 20px;
  }

  .icon {
    width: 20px;
  }
</style>
