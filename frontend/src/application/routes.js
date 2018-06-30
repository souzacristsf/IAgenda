import { store as auth } from './Auth'
import { routes as home } from './Home'
import { routes as agenda } from './Agenda'

export default [ ...home, ...agenda, ...auth ]
