// store/authSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setAuthToken } from '../services/api'

interface AuthState {
    user: { loggedIn: boolean, is_plus?: boolean; plus_expiry?: string | null } | null
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
        setToken: (state, action: PayloadAction<{ token: string; refresh: string; is_plus?: boolean; plus_expiry?: string } | null>) => {
            if (action.payload) {
                const { token, refresh, is_plus, plus_expiry } = action.payload;
                state.token = token
                state.refresh = refresh
                state.user = { loggedIn: true, is_plus, plus_expiry }
                localStorage.setItem('token', token)
                localStorage.setItem('refresh', refresh)
                setAuthToken(token)
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