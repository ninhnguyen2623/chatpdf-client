// store/authSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setAuthToken } from '../services/api'

interface AuthState {
    user: { loggedIn: boolean } | null
    token: string | null
    refresh: string | null  // Thêm refresh token
}

const initialToken = localStorage.getItem('token')
const initialRefresh = localStorage.getItem('refresh')
const initialState: AuthState = {
    user: initialToken ? { loggedIn: true } : null,
    token: initialToken,
    refresh: initialRefresh,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<{ token: string; refresh: string } | null>) => {
            if (action.payload) {
                state.token = action.payload.token
                state.refresh = action.payload.refresh
                state.user = { loggedIn: true }
                localStorage.setItem('token', action.payload.token)
                localStorage.setItem('refresh', action.payload.refresh)
                setAuthToken(action.payload.token)
            } else {
                state.user = null
                state.token = null
                state.refresh = null
                localStorage.removeItem('token')
                localStorage.removeItem('refresh')
                setAuthToken(null)
            }
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.refresh = null
            localStorage.removeItem('token')
            localStorage.removeItem('refresh')
            setAuthToken(null)
        },
    },
})

export const { setToken, logout } = authSlice.actions
export default authSlice.reducer