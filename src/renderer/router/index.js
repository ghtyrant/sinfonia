import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'sound-editor',
      component: require('@/components/SoundEditor').default
    },
    {
      path: '/trigger',
      name: 'trigger-list',
      component: require('@/components/TriggerList').default
    },
    {
      path: '/config',
      name: 'settings',
      component: require('@/components/Settings').default
    },
    {
      path: '/about',
      name: 'about',
      component: require('@/components/About').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
