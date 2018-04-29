<template>
  <div id="app">
    <link rel="stylesheet" href="/node_modules/element-theme-chalk/lib/index.css">

    <el-container class="height">
      <SideMenu/>

      <el-container class="content">
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import SideMenu from './components/SideMenu'

  export default {
    name: 'Sinfonia',
    data () {
      return {
        backend_process: null
      }
    },

    components: {
      SideMenu
    },

    computed: {
      status () {
        return this.$store.getters.status
      }
    },

    mounted () {
      this.interval = setInterval(this.updateStatus, 1000)
    },

    methods: {
      updateStatus () {
        this.$store.dispatch('updateStatus')
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body, html {
    height: 100%;
    font-family: 'Source Sans Pro', sans-serif;
    overflow: hidden;
  }

  .height {
    height: 100%;
    position: relative;
  }

  .content {
    margin-left: 200px;
    width: 100%;
    /*height: 100%;*/
    padding: 0;
  }
</style>
