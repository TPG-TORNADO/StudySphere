import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://studysphere-production-a885.up.railway.app'
const API_URL = `${BASE_URL}/api`

const api = axios.create({
  baseURL: API_URL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studysphere_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
export function uploadProfileImage(file) {
  const formData = new FormData()

  formData.append('file', file)

  return api.post('/users/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
