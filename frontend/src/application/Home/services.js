import { http } from '@/plugins/http'

export const getMySchedule = data => {
  console.log('Entrou aqui no getMySchedule: ', data)
  return http.get(`/api/schedule/${data}`).then(response => response.data)
}
