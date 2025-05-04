import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setAuthToken } from '../services/api'

interface AuthState {
    user: { loggedIn: boolean, is_plus?: boolean; plus_expiry?: string | null; id?: number; username?: string; email?: string; name?: string; picture?: string } | null
    token: string | null
    refresh: string | null
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
        setToken: (state, action: PayloadAction<{ token: string; refresh: string; is_plus?: boolean; plus_expiry?: string; id?: number; username?: string; email?: string; name?: string; picture?: string } | null>) => {
            if (action.payload) {
                const { token, refresh, is_plus, plus_expiry, id, username, email, name, picture } = action.payload;
                state.token = token
                state.refresh = refresh
                state.user = { loggedIn: true, is_plus, plus_expiry, id, username, email, name, picture }
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
        setUser: (state, action: PayloadAction<{ id: number; username: string; is_plus: boolean; plus_expiry: string | null; email?: string; name?: string; picture?: string }>) => {
            state.user = {
                loggedIn: true,
                id: action.payload.id,
                username: action.payload.username,
                is_plus: action.payload.is_plus,
                plus_expiry: action.payload.plus_expiry,
                email: action.payload.email,
                name: action.payload.name,
                picture: action.payload.picture,
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

export const { setToken, setUser, logout } = authSlice.actions
export default authSlice.reducer