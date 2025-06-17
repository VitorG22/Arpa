import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router.tsx'
import { RouterProvider } from 'react-router-dom'
import {store} from './redux/store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </StrictMode>,
)