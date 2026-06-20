import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
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
