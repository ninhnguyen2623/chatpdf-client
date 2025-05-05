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
    const [showPassword, setShowPassword] = useState(false);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-8 pt-8 pb-10">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Login</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Welcome back! Please sign in to continue
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                                        placeholder="Enter your email"
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-medium text-orange-500 hover:text-orange-600"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                    <div
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24px"
                                                viewBox="0 -960 960 960"
                                                width="24px"
                                                fill="#a8a8a8"
                                            >
                                                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24px"
                                                viewBox="0 -960 960 960"
                                                width="24px"
                                                fill="#a8a8a8"
                                            >
                                                <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Login button */}
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 transition duration-150 ease-in-out"
                            >
                                {loading ? 'Logging In...' : 'Log In'}
                            </button>
                        </div>
                    </form>

                    {/* Google login */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                text="signin_with" // Hiển thị nút "Sign in with Google"
                                shape="rectangular"
                                theme="outline"
                                size="large"
                            />
                            {/* <GoogleLoginButton /> */}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-orange-500 hover:text-orange-600"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage


// const GoogleLoginButton = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const handleGoogleSuccess = async (credentialResponse: any) => {
//         try {
//             const credential = credentialResponse.credential;
//             if (!credential) {
//                 throw new Error('No credential received from Google');
//             }

//             // Giải mã Google token để lấy email, name, picture
//             const decodedToken: GoogleTokenPayload = jwtDecode(credential);
//             const userEmail = decodedToken.email;
//             const userName = decodedToken.name || userEmail.split('@')[0];
//             const userPicture = decodedToken.picture || '';

//             // Gửi credential token lên server để đăng nhập
//             const response = await googleLogin({ credential });

//             dispatch(setToken({ token: response.data.access, refresh: response.data.refresh }));
//             localStorage.setItem('name', userEmail);
//             localStorage.setItem('picture', userPicture);

//             toast.success(`🎉 Đăng nhập bằng Google thành công, ${userName}!`, {
//                 position: "top-center",
//                 autoClose: 1000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: false,
//                 draggable: true,
//                 theme: "light",
//                 onClose: () => navigate('/'),
//             });
//         } catch (err) {
//             console.error('Google Login Error:', err);
//             toast.error('Đăng nhập Google thất bại');
//         }
//     };

//     const handleGoogleError = () => {
//         toast.error('Đăng nhập Google thất bại');
//     };

//     const login = useGoogleLogin({
//         flow: 'implicit', // hoặc 'auth-code' tùy backend
//         onSuccess: handleGoogleSuccess,
//         onError: handleGoogleError,
//     });

//     return (
//         <button
//             onClick={() => login()}
//             className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
//         >
//             <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2">
//                 <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
//                 <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
//                 <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
//                 <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
//             </svg>
//             <span>Sign in with Google</span>
//         </button>
//     );
// };