import { http } from '@/plugins/http'

export const doLogin = data => {
  return http.post('/api/auth', data).then(response => response.data)
}

export const loadUserData = data => {
  return http.post('/auth/login', data).then(response => response.data)
}

export const create = data => {
  return http.post('/api/users', data).then(response => response.data)
}
