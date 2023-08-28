import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import { auth } from '../firebase/init'
import { useUser } from '../context/UserContext'

export const useAuth = () => {
  const { addUser, setLoading } = useUser()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      addUser(user)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string, callback?: () => void) => {
    try {
      setLoading(true)
      
      const res = await signInWithEmailAndPassword(auth, email, password)
      if (res?.user) {
        localStorage.setItem('auth-token', res.user.refreshToken)
      }

      setLoading(false)
      if (callback) callback()
    } catch (error) {
      console.log(error)
      setError(String(error))
    }
  }

  const logout = async (callback?: () => void) => {
    try {
      setLoading(true)

      await signOut(auth)
      localStorage.removeItem('auth-token')

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
