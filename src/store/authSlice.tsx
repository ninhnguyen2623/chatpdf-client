import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setAuthToken } from '../services/api'

interface AuthState {
    user: { loggedIn: boolean } | null
    token: string | null
}

// Khôi phục trạng thái từ localStorage
const initialToken = localStorage.getItem('token')
const initialState: AuthState = {
    user: initialToken ? { loggedIn: true } : null,
    token: initialToken,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload
            if (action.payload) {
                state.user = { loggedIn: true }
                localStorage.setItem('token', action.payload)
                setAuthToken(action.payload)
            } else {
                state.user = null
                localStorage.removeItem('token')
                setAuthToken(null)
            }
        },
        logout: (state) => {
            state.user = null
            state.token = null
            localStorage.removeItem('token')
            setAuthToken(null)
        },
    },
})

export const { setToken, logout } = authSlice.actions
export default authSlice.reducer