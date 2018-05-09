import Agenda from './Components/Agenda'
import Criar from './Components/Criar.vue'

export default [
  {
    path: '/agenda',
    name: 'Agenda',
    component: Agenda,
    meta: { requiresAuth: true }
  },
  {
    path: '/criarAgenda',
    name: 'CriarAgenda',
    component: Criar,
    meta: { requiresAuth: true }
  }
]
