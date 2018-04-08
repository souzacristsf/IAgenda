import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import Signin from '@/app/Auth/Components/Signin'
import Signup from '@/app/Auth/Components/Signup'
import Full from '@/containers/Full'

Vue.use(Router)

// const load = component => () => import(`@/app/${component}/Components/${component}.vue`)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/auth/signin'
    },
    {
      path: '/auth/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/auth/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/home',
      name: 'Home',
      component: Full,
      children: routes
    }
  ]
})
