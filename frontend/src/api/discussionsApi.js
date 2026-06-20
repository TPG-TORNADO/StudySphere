import api from './api'

export function getPosts(groupId) {
  return api.get(`/groups/${groupId}/posts`)
}

export function createPost(groupId, payload) {
  return api.post(`/groups/${groupId}/posts`, payload)
}

export function getComments(postId) {
  return api.get(`/posts/${postId}/comments`)
}

export function addComment(postId, payload) {
  return api.post(`/posts/${postId}/comments`, payload)
}

export function deletePost(postId) {
  return api.delete(`/posts/${postId}`)
}
