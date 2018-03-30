import Agenda from './Components/Agenda'

export default [
  {
    path: '/agenda',
    name: 'Agenda',
    component: Agenda,
    meta: { requiresAuth: true }
  }
]
