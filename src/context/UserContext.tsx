import { createContext, useState, useContext } from 'react'
import { User } from 'firebase/auth'

import { UserState } from 'types/UserInterface'
import { Loading } from 'src/components'
import { useLocation, useMatch } from 'react-router-dom'

const state = {
  user: null,
}
const UserContext = createContext({} as UserState)
export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const addUser = (user: User | null) => {
    setUser(user)
  }

  return (
    <UserContext.Provider
      value={{ ...state, user, addUser, loading, setLoading }}>
      {loading && <Loading />}
      {children}
    </UserContext.Provider>
  )
}
