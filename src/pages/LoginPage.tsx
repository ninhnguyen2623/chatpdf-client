import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { setToken } from '../store/authSlice'
import { login, googleLogin } from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode';
interface GoogleTokenPayload {
    email: string;
    name?: string;
    sub: string;
    picture?: string; // Thêm trường picture
    [key: string]: unknown;

}
interface AuthResponse {
    refresh: string;
    access: string;
    user?: {  // Optional vì không phải endpoint nào cũng trả về user
        id?: number;
        username?: string;
        email?: string;
        name?: string;
        picture?: string;
    };
}
const LoginPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { user, token } = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (user && token) {
            navigate('/', { replace: true })
        }
    }, [user, token, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await login({ email, password }) as { data: AuthResponse };
            dispatch(setToken({ token: response.data.access, refresh: response.data.refresh }))
            if (response.data.user) {
                localStorage.setItem('name', response.data.user.name || email);
                localStorage.setItem('picture', response.data.user.picture || '');
            } else {
                localStorage.setItem('name', email); // Fallback về email nếu không có user
                localStorage.setItem('picture', ''); // Mặc định rỗng
            }
            toast.success(`🎉 Chào mừng đăng nhập thành công.`, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light",
                onClose: () => navigate('/'),
            })
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const errorMsg = err.response.data.error || 'Invalid credentials'
                toast.error(errorMsg)

            } else {
                toast.warn("An unexpected error occurred")

            }
        } finally {
            setLoading(false)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const credential = credentialResponse.credential;
            if (!credential) {
                throw new Error('No credential received from Google');
            }

            // Giải mã Google token để lấy email và picture
            const decodedToken: GoogleTokenPayload = jwtDecode(credential); // Sửa jwt_decode thành jwtDecode
            const userEmail = decodedToken.email;
            const userName = decodedToken.name || userEmail.split('@')[0];
            const userPicture = decodedToken.picture || '';

            const response = await googleLogin({ credential });
            dispatch(setToken({ token: response.data.access, refresh: response.data.refresh }));
            localStorage.setItem('name', userEmail);
            localStorage.setItem('picture', userPicture);
            toast.success(`🎉 Đăng nhập bằng Google thành công, ${userName}!`, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "light",
                onClose: () => navigate('/'),
            });
        } catch (err) {
            console.error('Google Login Error:', err);
            toast.error('Đăng nhập Google thất bại');
        }
    };

    const handleGoogleError = () => {
        toast.error('Đăng nhập Google thất bại')

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
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                            disabled={loading}
                        />
                    </div>
                    <p className="my-3 text-center text-gray-600">
                        Forgot your password?{' '}
                        <Link to="/forgot-password" className="text-orange-500 hover:underline">Forgot password</Link>
                    </p>
                    <button
                        type="submit"
                        className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-orange-300"
                        disabled={loading}
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
                <div className="mt-2 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="signin_with" // Hiển thị nút "Sign in with Google"
                        shape="rectangular"
                        theme="outline"
                        size="large"
                    />
                </div>

                <p className="mt-4 text-center text-gray-600">
                    Don’t have an account?{' '}
                    <Link to="/register" className="text-orange-500 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage