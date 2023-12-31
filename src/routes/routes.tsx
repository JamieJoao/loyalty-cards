import { HashRouter, Navigate, useRoutes, BrowserRouter } from "react-router-dom"

import { NavbarCustom } from "src/components/commons/navbar"
import { useUser } from "src/context/UserContext"
import { CustomizeForms, Dashboard, Login, Product, Ticket } from "src/pages"
import { Customer } from "src/pages/customer/customer"
import { GenerateLink } from "src/pages/generate-link/GenerateLink"
import { Statistics } from "src/pages/reports/statistics"
import { Purchases } from "src/pages/reports/Purchases"

const ConditionalRouter = import.meta.env.DEV ? BrowserRouter : HashRouter

const getAuthRoute = (element: JSX.Element, isAuthenticated: boolean) => (
  isAuthenticated ? element : <Navigate to='/login' />
)

const routesArray = (isAuthenticated: boolean) => [
  {
    path: '',
    element: getAuthRoute(<NavbarCustom />, isAuthenticated),
    children: [
      {
        path: '',
        element: getAuthRoute(<Dashboard />, isAuthenticated),
      },
      {
        path: 'user-form',
        element: getAuthRoute(<CustomizeForms />, isAuthenticated),
      },
      {
        path: 'purchases',
        element: getAuthRoute(<Purchases />, isAuthenticated),
      },
      {
        path: 'statistics',
        element: getAuthRoute(<Statistics />, isAuthenticated),
      },
      {
        path: 'generate-link',
        element: getAuthRoute(<GenerateLink />, isAuthenticated),
        children: [
          {
            path: 'id=:id',
            element: getAuthRoute(<GenerateLink />, isAuthenticated),
          }
        ]
      },
      {
        path: 'product',
        element: getAuthRoute(<Product />, isAuthenticated),
      },
    ]
  },
  {
    path: 'login',
    element: isAuthenticated ? <Navigate to='/' /> : <Login />
  },
  {
    path: 'mi-ticket/:id',
    element: <Ticket />
  },
  {
    path: 'cliente/:id',
    element: <Customer />
  },
]

export const RouterGroup = () => {
  const { token } = useUser()
  const routes = useRoutes(routesArray(Boolean(token)))

  return routes
}

export const RouterMain = () => {
  return (
    <ConditionalRouter>
      <RouterGroup />
    </ConditionalRouter>
  )
}
