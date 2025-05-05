import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import ChatWindow from '../components/Chat/ChatWindow';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUser } from '../store/authSlice';
import { api } from '../services/api';

const Home: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const hasFetched = useRef(false); // Ngăn fetchUser gọi lại

    // Hàm toggle Sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Lấy thông tin user từ API
    const fetchUser = async () => {
        if (!token || hasFetched.current) {
            console.warn('Không có token hoặc đã fetch, bỏ qua fetchUser');
            return;
        }
        try {
            const response = await api.get('/user/');
            const data = response.data;
            // So sánh dữ liệu để tránh dispatch không cần thiết
            if (
                user?.id !== data.id ||
                user?.username !== data.username ||
                user?.email !== data.email ||
                user?.is_plus !== data.is_plus ||
                user?.plus_expiry !== data.plus_expiry ||
                user?.name !== data.name ||
                user?.picture !== data.picture
            ) {
                dispatch(setUser({
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    is_plus: data.is_plus,
                    plus_expiry: data.plus_expiry,
                    name: data.name,
                    picture: data.picture,
                }));
                console.log('User updated:', data);
            }
            hasFetched.current = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(`Lỗi khi lấy thông tin user: ${err.response?.data?.message || err.message}`);
            console.error('Fetch user failed:', err);
        }
    };

    // Xử lý redirect từ PayPal
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentStatus = params.get('payment');

        if (paymentStatus) {
            hasFetched.current = false; // Cho phép fetchUser khi thanh toán
            switch (paymentStatus) {
                case 'success':
                    toast.success('Thanh toán thành công!');
                    fetchUser();
                    break;
                case 'failed':
                    toast.error('Thanh toán thất bại!');
                    break;
                case 'canceled':
                    toast.error('Thanh toán bị hủy!');
                    break;
                default:
                    console.warn('Payment status không xác định:', paymentStatus);
            }
            navigate(location.pathname, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, navigate]);

    // Kiểm tra token và làm mới user khi tải trang
    useEffect(() => {
        if (!user || !token) {
            navigate('/login', { replace: true });
        } else if (!hasFetched.current) {
            fetchUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, navigate]);

    return (
        <div>
            {user && token ? (
                <div className="h-screen flex relative">
                    <ToastContainer
                        position="top-right"
                        autoClose={1300}
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
                    <div className="h-full fixed">
                        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                    </div>
                    <div
                        className={`w-full h-full transition-all duration-800 ease-in-out ${sidebarOpen ? 'sm:pl-0 md:pl-[300px]' : 'pl-0'
                            }`}
                    >
                        <ChatWindow toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to ChatPDF</h1>
                    <p className="text-gray-600 mb-6">Please log in to start chatting with your PDFs.</p>
                    <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Log In
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;