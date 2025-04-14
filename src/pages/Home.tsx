import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import ChatWindow from '../components/Chat/ChatWindow'
import { Link, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { Bounce, ToastContainer } from 'react-toastify'
const Home: React.FC = () => {
    const { user, token } = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // Nếu không có user hoặc token, chuyển hướng về login
        if (!user || !token) {
            navigate('/login', { replace: true }) // Sử dụng replace để không thêm vào history
        }
    }, [user, token, navigate])
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="">


            {user && token ? (
                <div className="h-screen flex relative ">
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
                    <div className="h-full fixed ">
                        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                    </div>
                    <div className={`w-full h-full transition-all duration-800 ease-in-out ${sidebarOpen ? 'sm:pl-0 md:pl-[300px]' : ' pl-0 '} `}>
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
    )
}

export default Home