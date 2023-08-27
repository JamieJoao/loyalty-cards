import { Navigate } from "react-router-dom"

import { useUser } from "../context/UserContext"
import { useAuth } from "../hooks/useAuth"

export const Login = () => {
  const { user } = useUser()
  const { login } = useAuth()

  const handleLogin = () => {
    login('jojham1994@gmail.com', 'LK27r^i7^y<l6d~&_}')
  }

  return user
    ? <Navigate to='/' />
    : (
      <>
        <h1>Login</h1>
        {JSON.stringify(user, null, 2)}
        <button onClick={handleLogin}>Ingresar</button>
      </>
    )
}