import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { setUser } from '../store/authSlice';

export default function PaymentSuccess() {
    const { user, token } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const hasFetched = useRef(false);


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
        } catch (err: any) {
            toast.error(`Lỗi khi lấy thông tin user: ${err.response?.data?.message || err.message}`);
            console.error('Fetch user failed:', err);
        }
    };
    useEffect(() => {
        toast.success('Thanh toán thành công!');
        fetchUser()
    }, []);

    const formatExpiry = (expiry: string | null) => {
        if (!expiry) return 'N/A';
        return new Date(expiry).toLocaleDateString('vi-VN');
    };

    const getPlanName = () => {
        const urlParams = new URLSearchParams(location.search);
        const plan = urlParams.get('plan');
        return plan === 'monthly' ? 'Gói 1 tháng' : plan === 'yearly' ? 'Gói 1 năm' : 'Gói Plus';
    };

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-6"
            style={{
                background:
                    "linear-gradient(180deg,rgb(253, 202, 170) 0%,rgb(255, 251, 233) 50%,rgb(255, 255, 255) 100%)",
            }}
        >
            <div style={{ maxWidth: "1000px" }}>
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center mr-2">
                            <div className="text-white font-bold text-xl">P</div>
                        </div>
                        <h1 className="text-2xl font-bold">ChatPDF</h1>
                    </div>
                    <h2 className="text-3xl font-bold text-black">Thanh toán thành công!</h2>
                    <p className="text-lg text-gray-600 mt-2">
                        Chúc mừng bạn đã nâng cấp lên {getPlanName()}!
                    </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-2xl border border-gray-200 text-center">
                    <svg
                        className="h-16 w-16 text-green-500 mx-auto mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <h3 className="text-xl font-medium mb-4">Xin chào, {user?.email || 'User'}!</h3>
                    <p className="text-gray-600 mb-2">
                        Bạn đã kích hoạt <strong>{getPlanName()}</strong>.
                    </p>
                    <p className="text-gray-600 mb-2">
                        Tài khoản Plus của bạn có hiệu lực đến: <strong>{formatExpiry(user?.plus_expiry || null)}</strong>
                    </p>
                    <p className="text-gray-600 mb-6">
                        Tận hưởng các tính năng cao cấp như không giới hạn tin nhắn, DeepSearch, và Aurora Images.
                    </p>
                    <button
                        onClick={handleReturnHome}
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Quay về Trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}