import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export const Login = () => {
  const { login, error } = useAuth()

  useEffect(() => {
    if (error) alert(error)
  }, [error])

  const handleLogin = () => {
    login('jojham1994@gmail.com', 'LK27r^i7^y<l6d~&_}')
  }

  return (
    <>
      <h1>Login</h1>
      <button onClick={handleLogin}>Ingresar</button>
    </>
  )
}