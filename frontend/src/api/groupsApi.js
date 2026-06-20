import api from './api'

export function getGroups() {
  return api.get('/groups')
}

export function searchGroups(query) {
  return api.get('/groups/search', {
    params: { query }
  })
}

export function getGroup(groupId) {
  return api.get(`/groups/${groupId}`)
}

export function createGroup(payload) {
  return api.post('/groups', payload)
}

export function joinGroup(groupId) {
  return api.post(`/groups/${groupId}/join`)
}

export function leaveGroup(groupId) {
  return api.delete(`/groups/${groupId}/leave`)
}

export function getMembers(groupId) {
  return api.get(`/groups/${groupId}/members`)
}

