import { http } from '@/plugins/http'

export const getMySchedule = data => {
  console.log('Entrou aqui no getMySchedule: ', data)
  return http.get(`/api/schedule/me/${data}`).then(response => response.data)
}

export const createEvent = data => {
  console.log('createEvent: ', data)
  return http.put(`/api/schedule/${data._id}`, data).then(response => response.data)
}
export const updateEvent = data => {
  console.log('share_user_id: ', data)
  console.log('updateEvent: ', `/api/schedule/${data._id}/event/${data.id_event}`)
  return http.put(`/api/schedule/${data._id}/event/${data.id_event}`, data).then(response => response.data)
}

export const deleteEvent = data => {
  console.log('deleteEvent: ', data)
  return http.delete(`/api/schedule/${data._id}/event/${data.id_event}`).then(response => response.data)
}

export const getUsers = () => {
  return http.get(`/api/users/`).then(response => response.data)
}
