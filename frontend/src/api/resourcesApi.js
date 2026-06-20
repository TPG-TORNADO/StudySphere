import api from './api'

export function getResources(groupId) {
  return api.get(`/groups/${groupId}/resources`)
}

export function searchResources(query) {
  return api.get('/resources/search', {
    params: { query }
  })
}

export function uploadResource(groupId, file) {
  const formData = new FormData()
  formData.append('file', file)

  return api.post(`/groups/${groupId}/resources`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function downloadResource(resourceId) {
  return api.get(`/resources/${resourceId}/download`, {
    responseType: 'blob'
  })
}