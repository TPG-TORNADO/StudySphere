import { createContext, useContext, useMemo, useState } from 'react'
import * as authApi from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('studysphere_user')
    return raw ? JSON.parse(raw) : null
  })

  async function login(credentials) {
    const { data } = await authApi.login(credentials)
    saveSession(data)
    return data
  }

  async function register(payload) {
    const { data } = await authApi.register(payload)
    saveSession(data)
    return data
  }

  function saveSession(data) {
    localStorage.setItem('studysphere_token', data.token)
    const nextUser = {
      id: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      bio: data.bio,
      profileImage: data.profileImage
    }
    localStorage.setItem('studysphere_user', JSON.stringify(nextUser))
    setUser(nextUser)
  }

  function logout() {
    localStorage.removeItem('studysphere_token')
    localStorage.removeItem('studysphere_user')
    setUser(null)
  }

  function updateUser(newData) {
    setUser((prev) => {
      const next = { ...prev, ...newData }
      localStorage.setItem('studysphere_user', JSON.stringify(next))
      return next
    })
  }

  const value = useMemo(() => ({ user, login, register, logout, updateUser }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

