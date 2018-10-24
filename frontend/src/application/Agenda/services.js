import { http } from '@/plugins/http'

export const createSchedule = data => {
  return http.post('/api/schedule', data).then(response => response.data)
}

export const loadUserData = data => {
  return http.post('/auth/login', data).then(response => response.data)
}

export const getMySchedule = data => {
  console.log('Entrou aqui no getMySchedule: ', data)
  return http.get(`/api/schedule/me/${data}`).then(response => response.data)
}

export const delMySchedule = data => {
  console.log('Entrou aqui no delMySchedule: ', data)
  return http.delete(`/api/schedule/${data}`).then(response => response.data)
}

export const editMySchedule = data => {
  console.log('Entrou aqui no editMySchedule: ', data)
  return http.put(`/api/schedule/${data._id}/edit`, data).then(response => response.data)
}
