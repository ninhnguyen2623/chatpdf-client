import React from 'react'
import { AiFillTikTok, AiOutlineSlack } from 'react-icons/ai'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { FaStar } from 'react-icons/fa6'

export default function Footer() {
    return (
        <div className='w-[70%] mt-20'>
            <div className="flex items-center">
                <AiOutlineSlack className="w-[40px] h-[40px] text-orange-400" />
                <p className="text-[15px] font-bold">Chat</p>
                <p className="text-[18px] font-bold">PDF</p>
            </div>
            <p className='pt-2 text-md ' >ChatPDF kết hợp trí tuệ ChatGPT và công nghệ <br />
                PDF AI để đem lại khả năng hiểu tài liệu thông <br />
                minh hơn. Tóm tắt, trò chuyện, phân tích - bắt <br />
                đầu ngay.</p>
            <div className="mt-5 py-3 mb-2 flex justify-between items-center">
                <div className="flex text-xl text-yellow-400 items-center space-x-2">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar /> <span className='text-gray-400 text-sm' >| 4.9</span>
                </div>
                <div className="flex text-2xl space-x-5">
                    <FaInstagram /><FaFacebook /><AiFillTikTok /><FaYoutube />
                </div>
            </div>
            <div className="w-full h-[1px] bg-gray-300"></div>
            <div className=" mt-5 mb-20 flex justify-between">
                <div className="">
                    <h3 className='font-medium mb-4'>FEATURES</h3>
                    <ul className='space-y-3 text-md text-gray-500'>
                        <li>Trò chuyện với PDF</li>
                        <li>Tóm tắt PDF</li>
                        <li>AI Scholar</li>
                        <li>PDF AI</li>
                    </ul>
                </div>
                <div className="">
                    <h3 className='font-medium mb-4'>CÔNG TY</h3>
                    <ul className='space-y-3 text-md text-gray-500'>
                        <li>Đối tác liên kết</li>
                        <li>Liên hệ</li>
                        <li>API Docs</li>
                    </ul>
                </div>
                <div className="">
                    <h3 className='font-medium mb-4'>PHÁP LÝ</h3>
                    <ul className='space-y-3 text-md text-gray-500'>
                        <li>Chính sách quyền riêng tu</li>
                        <li>Điều khoản & Điều kiện</li>
                        <li>Thông tin</li>
                    </ul>
                </div>
            </div>

        </div>
    )
}
