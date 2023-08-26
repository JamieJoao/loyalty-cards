import ReactDOM from 'react-dom/client'

import { RouterMain } from './routes/routes.tsx'

import './firebase/init.ts'
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterMain />,
)
