import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App.tsx'
import './index.css'
import { setToken } from './store/authSlice'

// Khôi phục trạng thái đăng nhập từ localStorage khi ứng dụng khởi động
const token = localStorage.getItem('token')
if (token) {
  store.dispatch(setToken(token)); // Khôi phục token vào Redux
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)