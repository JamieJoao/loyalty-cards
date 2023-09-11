import '../moment.config.ts'
import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'

import { UserProvider } from './context/UserContext.tsx'
import { RouterMain } from './routes/routes.tsx'

import './fire/init.ts'
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <UserProvider>
      <RouterMain />
    </UserProvider>
  </NextUIProvider>
)
