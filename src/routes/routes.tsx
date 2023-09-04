import {
  HashRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import {
  Dashboard,
  Login,
  Ticket,
} from 'pages/index'
import { isLoggedUser } from 'utils/functions'
import { useUser } from 'context/UserContext'
import { Customer } from 'src/pages/customer/Customer'

export const RouterMain = () => {
  const { user } = useUser()
  const isLogged = user ?? isLoggedUser()

  return (
    <HashRouter>
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

        <Route path='/mi-ticket/:id' element={<Ticket />} />
        <Route path='/cliente/:id' element={<Customer/>} />
        <Route element={<h1>404 bocato</h1>} />
      </Routes>
    </HashRouter>
  )
}
