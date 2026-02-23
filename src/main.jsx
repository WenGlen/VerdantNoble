import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'

import { createHashRouter, RouterProvider } from 'react-router-dom'
import getRoutes from './routes/index.jsx'

//const basename = import.meta.env.PROD ? '/Onlinestore-frontend' : ''

const router = createHashRouter(getRoutes())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
