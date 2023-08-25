import ReactDOM from 'react-dom/client'
import { RouterMain } from './routes/routes.tsx'
import './firebase/init.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterMain />,
)
