import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import {
  Dashboard,
  Login,
  Preview,
} from '../pages'
import { isLoggedUser } from '../utils/functions'
import { useUser } from '../context/UserContext'

export const RouterMain = () => {
  const { user } = useUser()
  const isLogged = user ?? isLoggedUser()

  return (
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/bocato-ticket/'}>
      <Routes>
        <Route
          path='/'
          element={
            isLogged
              ? <Dashboard />
              : <Navigate to='/login' replace />
          } />
        <Route
          path='/login'
          element={
            isLogged
              ? <Navigate to='/' replace />
              : <Login />
          } />

        <Route path='/preview/:id' element={<Preview />} />
        <Route element={<h1>404 bocato</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
