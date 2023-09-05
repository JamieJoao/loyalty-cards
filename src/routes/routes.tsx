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
import { TicketNotFound } from 'src/pages/ticket/TicketNotFound'

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
        <Route path='/cliente/:id' element={<Customer />} />
        <Route path='*' element={<TicketNotFound />} />
      </Routes>
    </HashRouter>
  )
}
