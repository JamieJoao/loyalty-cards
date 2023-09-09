import ReactDOM from 'react-dom/client'
import { NextUIProvider } from '@nextui-org/react'

// import { RouterMain } from './routes/routes.tsx'
import { UserProvider } from './context/UserContext.tsx'

import './fire/init.ts'
import './styles/main.scss'
import { RouterMain } from './routes/routes.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <UserProvider>
      <RouterMain />
    </UserProvider>
  </NextUIProvider>
)
