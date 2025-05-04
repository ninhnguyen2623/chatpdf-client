import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { api } from '../services/api';
import { toast } from 'react-toastify';

export default function Payment() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const { token } = useSelector((state: RootState) => state.auth);
    const price = billingCycle === "monthly" ? 20 : 200;

    const handleSubscribe = async () => {
        if (!token) {
            toast.error('Vui lòng đăng nhập để thanh toán');
            return;
        }
        try {
            const response = await api.post('/payment/paypal/', { plan: billingCycle });
            const { payment_url } = response.data;
            if (payment_url) {
                window.open(payment_url, '_blank');
            } else {
                throw new Error('Không thể tạo thanh toán');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Không thể khởi tạo thanh toán');
            console.error('Payment error:', err);
        }
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
                    <h2 className="text-3xl font-normal text-black">fds
                        Unlock advanced Capabilities
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Basic Plan */}
                    <div
                        className="bg-white p-8 rounded-lg shadow-2xl border border-gray-200"
                        style={{ boxShadow: "0 4px 40px rgba(0, 0, 0, 0.3)" }}
                    >
                        <div className="mb-6">
                            <h3 className="text-lg text-gray-600 mb-2">Basic</h3>
                            <div className="text-3xl font-bold">Free</div>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a8 8 0 0 0-8 8c0 2.76 1.12 5.26 2.93 7.07L12 22l5.07-4.93A10 10 0 0 0 20 10a8 8 0 0 0-8-8z" />
                                    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" />
                                </svg>
                                <div><p className="font-medium">ChatPDF Model</p></div>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                                <div><p className="font-medium">Aurora Image Model</p></div>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                </svg>
                                <div><p className="font-medium">Context Memory</p></div>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="2" x2="12" y2="6" />
                                    <line x1="12" y1="18" x2="12" y2="22" />
                                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                                    <line x1="2" y1="12" x2="6" y2="12" />
                                    <line x1="18" y1="12" x2="22" y2="12" />
                                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <div><p className="font-medium">Limited access to Thinking</p></div>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <div><p className="font-medium">Limited access to DeepSearch</p></div>
                            </li>
                            <li className="flex items-start">
                                <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="M6 8h.01M6 12h.01M6 16h.01M10 8h8M10 12h8M10 16h8" />
                                </svg>
                                <div><p className="font-medium">Limited access to DeeperSearch</p></div>
                            </li>
                        </ul>
                        <div className="mt-10">
                            <button className="w-full py-3 bg-gray-200 text-black font-medium rounded-lg">
                                Current
                            </button>
                        </div>
                    </div>
                    {/* Upgrade plan */}
                    <div
                        className="bg-white p-8 rounded-lg shadow-sm border border-gray-200"
                        style={{ boxShadow: "0 4px 40px rgba(0, 0, 0, 0.3)" }}
                    >
                        <div className="mb-6">
                            <h3 className="text-lg text-gray-600 mb-2">ChatPDF Pro</h3>
                            <div className="flex items-center">
                                <div className="text-3xl font-bold" key={billingCycle}>
                                    ${price}.00/ {billingCycle === "monthly" ? "month" : "year"}
                                </div>
                            </div>
                            <p className="text-orange-500 text-sm mt-1" key={billingCycle}>
                                {billingCycle === "monthly" ? "Get 20% off with yearly" : "$16.67/ month"}
                            </p>
                        </div>
                        <div className="flex border border-gray-200 rounded-full p-1 mb-6 relative" style={{ width: "fit-content" }}>
                            <div
                                className="absolute top-1 bottom-1 rounded-full bg-black z-0"
                                style={{
                                    width: "50%",
                                    height: "calc(100% - 8px)",
                                    transform: `translateX(${billingCycle === "monthly" ? "0%" : "100%"})`,
                                }}
                            />
                            <button
                                className={`px-4 py-1 rounded-full text-sm font-medium z-10 relative transition-colors duration-200 ${billingCycle === "monthly" ? "text-white" : "text-black"}`}
                                onClick={() => setBillingCycle("monthly")}
                            >
                                Monthly
                            </button>
                            <button
                                className={`px-4 py-1 rounded-full text-sm font-medium z-10 relative transition-colors duration-200 ${billingCycle === "yearly" ? "text-white" : "text-black"}`}
                                onClick={() => setBillingCycle("yearly")}
                            >
                                Yearly
                            </button>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2a8 8 0 0 0-8 8c0 2.76 1.12 5.26 2.93 7.07L12 22l5.07-4.93A10 10 0 0 0 20 10a8 8 0 0 0-8-8z" />
                                        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" />
                                    </svg>
                                    <div><p className="font-medium">More ChatPDF</p></div>
                                </div>
                                <span className="text-gray-500">100 Queries / 2h</span>
                            </li>
                            <li className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <div><p className="font-medium">More Aurora Images</p></div>
                                </div>
                                <span className="text-gray-500">100 Images / 2h</span>
                            </li>
                            <li className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7" />
                                        <rect x="14" y="3" width="7" height="7" />
                                        <rect x="14" y="14" width="7" height="7" />
                                        <rect x="3" y="14" width="7" height="7" />
                                    </svg>
                                    <div><p className="font-medium">Even Better Memory</p></div>
                                </div>
                                <span className="text-gray-500">128K Context Window</span>
                            </li>
                            <li className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="2" x2="12" y2="6" />
                                        <line x1="12" y1="18" x2="12" y2="22" />
                                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                                        <line x1="2" y1="12" x2="6" y2="12" />
                                        <line x1="18" y1="12" x2="22" y2="12" />
                                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <div><p className="font-medium">Extended access to Thinking</p></div>
                                </div>
                                <span className="text-gray-500">30 Queries / 2h</span>
                            </li>
                            <li className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <div><p className="font-medium">Extended access to DeepSearch</p></div>
                                </div>
                                <span className="text-gray-500">30 Queries / 2h</span>
                            </li>
                            <li className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <svg className="h-5 w-5 text-gray-500 mt-0.5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="M6 8h.01M6 12h.01M6 16h.01M10 8h8M10 12h8M10 16h8" />
                                    </svg>
                                    <div><p className="font-medium">Extended access to DeeperSearch</p></div>
                                </div>
                                <span className="text-gray-500">10 Queries / 2h</span>
                            </li>
                        </ul>
                        <div className="mt-10">
                            <button
                                onClick={handleSubscribe}
                                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                            >
                                Subscribe Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}