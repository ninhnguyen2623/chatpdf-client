import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { setToken } from '../store/authSlice'
import { login } from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Bounce, toast, ToastContainer } from 'react-toastify'

const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await login({ email, password })
            dispatch(setToken(response.data.access))
            localStorage.setItem('name', email);
            toast.success(`🎉 Chào mừng đăng nhập thành công.`, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light",
                onClose: () => navigate('/'), // Chuyển hướng sau khi toast đóng
            });

        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                toast.error(err.response.data.error || 'Invalid credentials')
                setError(err.response.data.error || 'Invalid credentials')
            } else {
                toast.warn("An unexpected error occurred")
                setError('An unexpected error occurred')
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
                transition={Bounce}
            />
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
                {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">
                            email
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                        Log In
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don’t have an account?{' '}
                    <Link to="/register" className="text-orange-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage