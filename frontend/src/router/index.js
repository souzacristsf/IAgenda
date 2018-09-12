import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import beforeEach from './beforeEach'
import Signin from '@/application/Auth/Components/Signin'
import Signup from '@/application/Auth/Components/Signup'
import Full from '@/containers/Full'

Vue.use(Router)

// const load = component => () => import(`@/app/${component}/Components/${component}.vue`)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/auth/signin'
    },
    {
      path: '/auth/signin',
      name: 'Signin',
      component: Signin,
      meta: { requiresAuth: false }
    },
    {
      path: '/auth/signup',
      name: 'Signup',
      component: Signup,
      meta: { requiresAuth: false }
    },
    {
      path: '/home',
      name: 'Home',
      component: Full,
      children: routes
    }
  ]
})

router.beforeEach(beforeEach)

export default router
