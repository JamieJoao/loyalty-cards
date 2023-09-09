import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import { auth } from 'fire/init'
import { useUser } from 'context/UserContext'

export const useAuth = () => {
  const { addUser, setLoading, setToken } = useUser()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      addUser(user)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string, callback?: () => void) => {
    setLoading(true)
    setError(null)
    try {

      const res = await signInWithEmailAndPassword(auth, email, password)
      if (res?.user) {
        setToken(res.user.refreshToken)
      }

      if (callback) callback()
    } catch (error) {
      console.log(error)
      setError(String(error))
    }

    setLoading(false)
  }

  const logout = async (callback?: () => void) => {
    try {
      setLoading(true)

      await signOut(auth)
      setToken(null)

      setLoading(false)
      if (callback) callback()
    } catch (error) {
      console.log(error)
      setError(String(error))
    }
  }

  return {
    login,
    logout,
    error,
  }
}
