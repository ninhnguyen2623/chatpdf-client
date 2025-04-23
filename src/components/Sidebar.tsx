import { HiMenuAlt3 } from "react-icons/hi";
import { IoFolderOutline } from "react-icons/io5";
import { MdOutlineErrorOutline } from "react-icons/md";
import { AiOutlineDash } from "react-icons/ai";
import { SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { GoCode, GoPlus } from "react-icons/go";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { chat, uploadPDF, deleteConversation, updateConversation, createVNPayPayment } from '../services/api';
import {
    setSelectedPdf,
    setConversationId,
    clearMessages,
    addConversation,
    setPdfUrl,
    deleteConversation as deleteConversationAction,
    updateConversation as updateConversationAction,
    setTitleConversation,
} from '../store/chatSlice';
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaCrown, FaRegEdit } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { LuMessageCircleMore } from "react-icons/lu";
import { AiOutlineSlack } from "react-icons/ai";


interface SidebarProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { token, user } = useSelector((state: RootState) => state.auth);
    const { conversations, conversationId, model } = useSelector((state: RootState) => state.chat);
    const [file, setFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null); // ID của cuộc hội thoại đang chỉnh sửa
    const [editTitle, setEditTitle] = useState<string>('');
    const [menuOpen, setMenuOpen] = useState<number | null>(null); // Tiêu đề đang chỉnh sửa
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const editInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate()
    const userName = localStorage.getItem('name') || 'My Account';
    const userPicture = localStorage.getItem('picture') || '';
    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem('name');
        navigate('/login')
        toast.success("Đã đăng xuất thành công!");
    }
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: userName, // Lấy name từ localStorage hoặc fallback là 'My Account'
            disabled: true,
        },
        { type: 'divider' },
        { key: '2', label: 'Profile', extra: '⌘P' },
        { key: '3', label: 'Billing', extra: '⌘B' },
        { key: '4', label: 'Settings', icon: <SettingOutlined />, extra: '⌘S' },
        {
            key: '5',
            label: 'Logout',
            danger: true, // Hiển thị màu đỏ
            onClick: handleLogout, // Gọi hàm logout khi click
        },
    ];


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };
    // rút ngắn hội thại 
    const truncateTitle = (title: string, maxLength: number = 20) => {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength) + " ...";
    };
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Mở hộp thoại chọn file khi nhấp vào <p>
        }
    };

    // xử lý plus
    const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
        try {
            const response = await createVNPayPayment(plan);
            window.open(response.data.payment_url, '_blank');  // Chuyển hướng đến VNPay
        } catch (err) {
            toast.error('Không thể khởi tạo thanh toán');
        }
    };

    // Format ngày hết hạn
    const formatExpiry = (expiry: string | null) => {
        if (!expiry) return '';
        return new Date(expiry).toLocaleDateString('vi-VN');
    };

    // xủ lý uplaod file
    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !token) {
            toast.error("Vui lòng chọn file PDF!");
            return;
        }

        const loadingToastId = toast.loading("Đang tải lên...");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);

        try {
            const uploadResponse = await uploadPDF(formData);
            const pdfId = uploadResponse.data.id;

            const chatResponse = await chat({
                pdf_id: pdfId,
                message: "Hello ChatPdf",
                model,
                title: file.name,
            });

            const newConversation = {
                id: chatResponse.data.conversation_id,
                title: file.name,
                created_at: new Date().toISOString(),
                pdf: pdfId,
                pdf_url: chatResponse.data.pdf_url,
            };

            dispatch(addConversation(newConversation));
            dispatch(setSelectedPdf(pdfId));
            dispatch(setConversationId(chatResponse.data.conversation_id));
            dispatch(setPdfUrl(chatResponse.data.pdf_url));
            dispatch(clearMessages());

            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            toast.update(loadingToastId, {
                render: "Tải file lên thành công!",
                type: "success",
                isLoading: false,
                autoClose: 1300,
            });
        } catch (err) {
            toast.update(loadingToastId, {
                render: "Tải file lên thất bại!",
                type: "error",
                isLoading: false,
                autoClose: 1300,
            });
        }
    };

    const handleConversationSelect = (conv: { id: number; pdf: number; pdf_url?: string; title: string }) => {
        dispatch(setSelectedPdf(conv.pdf));
        dispatch(setTitleConversation(conv.title));
        dispatch(setConversationId(conv.id));
        dispatch(setPdfUrl(conv.pdf_url || null));
    };

    const handleDelete = async (conversationId: number) => {
        try {
            await deleteConversation(conversationId);
            dispatch(deleteConversationAction(conversationId));
            toast.success("Delete conversation successfully ");
        } catch (err) {
            toast.error("Failed delete conversation:", err);
            console.error('Failed to delete conversation:', err);
        }
    };
    const confirmDelete = (conversationId: number) => {
        toast(
            <div>
                <div className='flex'><MdOutlineErrorOutline className='text-red-500 text-2xl mr-2' />Bạn có chắc chắn muốn xóa cuộc hội thoại này?</div>
                <div className="flex space-x-2 mt-3 ml-5">
                    <button
                        onClick={() => {
                            handleDelete(conversationId);
                            toast.dismiss(); // Đóng toast sau khi xóa
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                    >
                        Xác nhận
                    </button>
                    <button
                        onClick={() => toast.dismiss()} // Đóng toast khi hủy
                        className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-200"
                    >
                        Hủy
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false, // Không tự động đóng để người dùng chọn
                closeButton: false, // Ẩn nút đóng mặc định
                draggable: false,
            }
        );
    };

    const handleEdit = async (conversationId: number, newTitle: string) => {
        try {
            await updateConversation(conversationId, newTitle);
            dispatch(updateConversationAction({ id: conversationId, title: newTitle }));
            dispatch(setTitleConversation(newTitle))
            setEditingId(null); // Thoát chế độ chỉnh sửa
            setEditTitle('');
            toast.success("Edit conversation successfully ");
        } catch (err) {
            toast.error("Failed edit conversation:", err);
            console.error('Failed to update conversation:', err);
        }
    };

    const startEditing = (conv: { id: number; title: string }) => {
        setEditingId(conv.id);
        setEditTitle(conv.title);
        setMenuOpen(null);
    };

    const handleBlurOrEnter = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>, conversationId: number) => {
        if ((e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter') || e.type === 'blur') {
            handleEdit(conversationId, editTitle);
        }
    };
    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingId]);

    return (
        <div className={`absolute z-50 h-full transition-transform duration-800 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full pl-[-244px]"}`}>
            <div className='bg-sidebar bg-neutral-900 w-[300px] h-full relative text-white'>
                <header>
                    <div className="flex justify-between w-full h-[56px] ml-3">
                        <div className="flex items-center justify-center">
                            <AiOutlineSlack className="w-[40px] h-[40px] text-orange-400" />
                            <p className="text-[15px] font-bold">Chat</p>
                            <p className="text-[18px] font-bold">PDF</p>
                        </div>
                        <div className="flex items-center justify-center mr-7 text-2xl font-bold">
                            <button onClick={toggleSidebar}>
                                <HiMenuAlt3 />
                            </button>
                        </div>

                    </div>
                </header>
                <div className="mt-2">
                    <form onSubmit={handleFileUpload}>
                        <div className="flex border-[1px] border-gray-600 space-x-3 p-2 mx-3 w-[90%] rounded-[10px] items-center justify-center hover:bg-neutral-800">
                            <IoFolderOutline />
                            <div className="text-sm  flex items-center space-x-2">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden" // Ẩn hoàn toàn input
                                />
                                <p
                                    className="truncate-text cursor-pointer"
                                    onClick={triggerFileInput}
                                    title={file ? file.name : "Chọn file PDF"} // Tooltip hiển thị tên đầy đủ
                                >
                                    {file ? truncateTitle(file.name) : "Thư mục mới"}
                                </p>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="flex w-[90%] mt-3 border-[1px] justify-center border-gray-600 space-x-3 p-2 mx-3 rounded-[10px] items-center hover:bg-neutral-800"
                        >
                            <GoPlus />
                            <p className='text-sm'>Cuộc trò chuyện mới</p>
                        </button>
                    </form>
                </div>
                <div className="h-[480px] overflow-y-auto overflow-x-hidden scroll custom-scrollbar">
                    <div className="mt-5">
                        <p className='text-[12px] ml-5 font-bold'>Hôm nay</p>
                        <div className="">
                            {conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`flex justify-between space-x-2 p-2 mx-3 mt-2 rounded-[10px] items-center hover:bg-neutral-800 ${conversationId === conv.id ? 'bg-gray-800' : ''
                                        }`}
                                >
                                    <LuMessageCircleMore className="text-xl" />
                                    {editingId === conv.id ? (
                                        <input
                                            ref={editInputRef}
                                            type="text"
                                            value={editTitle}
                                            onChange={e => setEditTitle(e.target.value)}
                                            onBlur={e => handleBlurOrEnter(e, conv.id)}
                                            onKeyDown={e => handleBlurOrEnter(e, conv.id)}
                                            className="text-sm w-full bg-transparent border-none outline-none"
                                            autoFocus
                                        />
                                    ) : (
                                        <p
                                            className='text-sm cursor-text flex-1'
                                            onClick={() => handleConversationSelect(conv)}
                                            onDoubleClick={() => startEditing(conv)} // Nhấp đúp để sửa
                                        >
                                            {truncateTitle(conv.title)}
                                        </p>
                                    )}
                                    <div className="relative">
                                        <button
                                            onClick={() => setMenuOpen(menuOpen === conv.id ? null : conv.id)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <AiOutlineDash />
                                        </button>
                                        {menuOpen === conv.id && (
                                            <div className="absolute right-0 h-[90px] w-[100px] border-gray-200 border-1 bg-white rounded-xl shadow-lg z-10">
                                                <div className="p-2">
                                                    <button
                                                        onClick={() => startEditing(conv)}
                                                        className="flex items-center w-full p-2 ml-0.5 text-left rounded-sm space-x-1.5 hover:bg-gray-200 text-black"
                                                    >
                                                        <FaRegEdit className="text-[15px] " />
                                                        <span className="text-sm">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(conv.id)}
                                                        className="flex items-center w-full p-2 text-left rounded-sm space-x-1.5 hover:bg-gray-200 text-red-500"
                                                    >
                                                        <AiOutlineDelete className="text-left text-[17px]" />
                                                        <span className="text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 mb-2 mr-2 left-0 w-full p-2">
                    <Dropdown menu={{ items }}>
                        <a onClick={(e) => e.preventDefault()}>
                            <div className="flex justify-between items-center h-[56px] px-4 border-gray-600 shadow-md rounded-[10px]">
                                <div className="flex space-x-3 items-center">
                                    {userPicture ? (
                                        <img
                                            src={userPicture}
                                            alt="User Avatar"
                                            className="w-[35px] h-[35px] rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <div className="w-[35px] h-[35px] bg-neutral-600 flex items-center justify-center rounded-2xl text-white font-bold uppercase">
                                            {userName?.slice(0, 2)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-md font-medium">{userName}</p>
                                        {user?.is_plus && (
                                            <div className="flex items-center">
                                                <FaCrown className="text-yellow-400 mr-1" />
                                                <p className="text-xs">Hết hạn: {formatExpiry(user.plus_expiry || null)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-3 rotate-90">
                                    <Space>
                                        <GoCode />
                                    </Space>
                                </div>
                            </div>
                        </a>
                    </Dropdown>
                    {!user?.is_plus && (
                        <div className="flex items-center justify-center">
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: '1',
                                            label: 'Gói 1 tháng - 500.000 VND',
                                            onClick: () => handleUpgrade('monthly'),
                                        },
                                        {
                                            key: '2',
                                            label: 'Gói 1 năm - 4.000.000 VND',
                                            onClick: () => handleUpgrade('yearly'),
                                        },
                                    ],
                                }}
                            >
                                <button className="w-[96%] h-[40px] bg-amber-600 rounded-[10px] hover:bg-amber-500">
                                    <div className="flex space-x-2 items-center justify-center">
                                        <img
                                            src="https://www.chatpdf.com/_next/static/media/UpgradeStarIcon.92a187c4.svg"
                                            alt=""
                                            width={20}
                                        />
                                        <p className="font-medium">Nâng cấp lên Plus</p>
                                    </div>
                                </button>
                            </Dropdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}