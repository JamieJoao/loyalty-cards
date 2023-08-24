import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { Dashboard } from '../pages/Dashboard'
import { Preview } from '../pages/Preview'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/preview',
    element: <Preview />
  }
])

export const RouterMain = () => <RouterProvider router={router} />
