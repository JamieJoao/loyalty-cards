import { useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import { auth } from '../firebase/init'
import { useUser } from '../context/UserContext'

export const useAuth = () => {
  const { addUser } = useUser()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      addUser(user)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.log(error)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    login,
    logout,
  }
}
