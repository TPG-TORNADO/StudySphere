import api from './api'

export function getProfile() {
  return api.get('/users/profile')
}

export function updateProfile(data) {
  return api.put('/users/profile', data)
}

export function uploadProfileImage(file) {
  const formData = new FormData()

  formData.append('file', file)

  return api.post('/users/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}