import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import { useUser } from "../context/UserContext"
import { Dashboard } from "../pages/Dashboard"

export const PrivateRoutes = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  return user ? <Dashboard /> : null
}
