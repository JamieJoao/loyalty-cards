import { createContext, useState, useContext, useEffect } from 'react'
import { User } from 'firebase/auth'

import { UserState } from 'types/UserInterface'

const state = {
  user: null,
  token: null
}
const UserContext = createContext({} as UserState)
export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth-token'))
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    localStorage.clear()
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth-token', token)
    }
    else {
      localStorage.removeItem('auth-token')
    }
  }, [token])

  const addUser = (user: User | null) => {
    setUser(user)
  }

  return (
    <UserContext.Provider
      value={{ ...state, user, addUser, loading, setLoading, token, setToken }}>
      {children}
    </UserContext.Provider>
  )
}
