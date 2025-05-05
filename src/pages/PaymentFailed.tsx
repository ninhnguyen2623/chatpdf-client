import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { toast } from 'react-toastify';

export default function PaymentFailed() {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const status = urlParams.get('status');
        if (status === 'failed') {
            toast.error('Thanh toán thất bại!');
        } else if (status === 'canceled') {
            toast.error('Thanh toán bị hủy!');
        } else {
            toast.error('Đã có lỗi xảy ra với thanh toán!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    <h2 className="text-3xl font-bold text-black">Thanh toán không thành công!</h2>
                    <p className="text-lg text-gray-600 mt-2">
                        Đã có lỗi xảy ra khi nâng cấp lên {getPlanName()}.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-2xl border border-gray-200 text-center">
                    <svg
                        className="h-16 w-16 text-red-500 mx-auto mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M15 9l-6 6" />
                        <path d="M9 9l6 6" />
                    </svg>
                    <h3 className="text-xl font-medium mb-4">Xin chào, {user?.email || 'User'}!</h3>
                    <p className="text-gray-600 mb-2">
                        Thanh toán cho <strong>{getPlanName()}</strong> không thành công.
                    </p>
                    <p className="text-gray-600 mb-6">
                        Vui lòng thử lại hoặc liên hệ hỗ trợ nếu bạn cần trợ giúp.
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