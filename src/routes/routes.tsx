import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { Dashboard } from '../pages/Dashboard'
import { Preview } from '../pages/Preview'
import { UserProvider } from '../context/UserContext'
import { Login } from '../pages/Login'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/preview/:id',
    element: <Preview />
  },
  {
    path: '/*',
    element: <h1>Not found</h1>
  }
])

export const RouterMain = () => (
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
)
