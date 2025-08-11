

import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
    <>
        <Provider store={store}>
            <RouterProvider router={router} />
            <Toaster position="top-center" reverseOrder={false} />
        </Provider>

    </>

)
