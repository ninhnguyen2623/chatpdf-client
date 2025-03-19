import { FaRegPenToSquare } from 'react-icons/fa6'
import { HiMenuAlt2, HiMenuAlt3 } from 'react-icons/hi'
import { SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { GoChevronDown } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { logout } from '../store/authSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import ModeSelect from './Chat/ModeSelect';

const url = 'https://pbs.twimg.com/profile_images/1633849057495113728/Z4DO3hZZ_400x400.jpg';


export default function Appbar({ toggleSidebar, sidebarOpen }: { toggleSidebar: () => void, sidebarOpen: boolean }) {
    const { user, token } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const userName = localStorage.getItem('name') || 'My Account';
    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem('name')
        navigate('/login')
        toast.success("Đã đăng xuất thành công!");
    }
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: userName,
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Profile',
            extra: '⌘P',
        },
        {
            key: '3',
            label: 'Billing',
            extra: '⌘B',
        },
        {
            key: '4',
            label: 'Settings',
            icon: <SettingOutlined />,
            extra: '⌘S',
        },
        {
            key: '5',
            label: 'Logout',
            danger: true, // Hiển thị màu đỏ
            onClick: handleLogout, // Gọi hàm logout khi click
        },
    ];

    useEffect(() => {
        if (!user || !token) {
            navigate('/login') // Chuyển hướng nếu chưa đăng nhập
        }
    }, [user, token, navigate])
    return (
        <div className={`w-full h-[8%] pl-2 pr-5 `}>
            <div className="flex justify-between w-full h-[56px]">
                <div className="flex items-center justify-center text-neutral-700 font-bold space-x-4">
                    {!sidebarOpen && (
                        <div className="flex items-center text-2xl text-neutral-700 font-bold space-x-4">
                            <button onClick={toggleSidebar}>
                                {sidebarOpen ? <HiMenuAlt3 /> : <HiMenuAlt2 />}
                            </button>
                        </div>
                    )}
                    <div className="">
                        <ModeSelect />
                    </div>
                </div>
                <div className="flex items-center space-x-3 text-xl  text-neutral-800">
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>

                                <img src={url} alt="Fume lovely" height={35} width={35} className=' rounded-2xl' />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}
