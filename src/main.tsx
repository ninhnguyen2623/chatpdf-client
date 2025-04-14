import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App.tsx'
import './index.css'
import { setToken } from './store/authSlice'
import { GoogleOAuthProvider } from '@react-oauth/google'
// Khôi phục trạng thái đăng nhập từ localStorage khi ứng dụng khởi động
const token = localStorage.getItem('token')
const refresh = localStorage.getItem('refresh')
if (token && refresh) {
  store.dispatch(setToken({ token, refresh })); // Khôi phục cả token và refresh
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="35413939010-glrhlm0ad67ppjae2neet0co3fi8rocr.apps.googleusercontent.com">
      <Provider store={store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)