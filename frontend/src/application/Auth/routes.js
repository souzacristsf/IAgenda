const load = component => () => import(`./Components/${component}.vue`)

export default [
  {
    path: '/auth/signin',
    name: 'Signin',
    component: load('Signin'),
    meta: { requiresAuth: false }
  }
]
