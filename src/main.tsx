import ReactDOM from 'react-dom/client'

import { RouterMain } from './routes/routes.tsx'
import { UserProvider } from './context/UserContext.tsx'

import './fire/init.ts'
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <RouterMain />
  </UserProvider>
)
