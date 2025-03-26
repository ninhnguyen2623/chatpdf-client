import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App.tsx'
import './index.css'
import { setToken } from './store/authSlice'

// Khôi phục trạng thái đăng nhập từ localStorage khi ứng dụng khởi động
const token = localStorage.getItem('token')
const refresh = localStorage.getItem('refresh')
if (token && refresh) {
  store.dispatch(setToken({ token, refresh })); // Khôi phục cả token và refresh
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)