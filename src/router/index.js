import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import Signin from '@/app/Auth/Components/Signin'
import Full from '@/containers/Full'

Vue.use(Router)

// const load = component => () => import(`@/app/${component}/Components/${component}.vue`)

export default new Router({
  routes: [
    {
      path: '/auth/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/',
      redirect: '/home',
      name: 'Home',
      component: Full,
      children: routes
    }
  ]
})
