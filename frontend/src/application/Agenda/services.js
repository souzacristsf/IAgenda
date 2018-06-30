import { http } from '@/plugins/http'

export const createSchedule = data => {
  return http.post('/api/schedule', data).then(response => response.data)
}

export const loadUserData = data => {
  return http.post('/auth/login', data).then(response => response.data)
}
