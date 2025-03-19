import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../store'
import { chat, deleteConversation, getHistory, getMessageHistory, summarizeConversation, uploadPDF } from '../../services/api'
import {
    setConversations,
    addMessage,
    setConversationId,
    setMessages,
    setPdfUrl,
    addConversation,
    setSelectedPdf,
    clearMessages,
    deleteConversation as deleteConversationAction,
    setTitleConversation,
} from '../../store/chatSlice'
import { Viewer } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { Worker } from '@react-pdf-viewer/core'
import AIResponse from '../AIResponse'
import { toast } from 'react-toastify'
import { FaFileWord, FaRegFileLines, FaRegFileWord, FaRegSquarePlus } from 'react-icons/fa6'
import { HiMenuAlt2, HiMenuAlt3 } from 'react-icons/hi'
import ModeSelect from './ModeSelect'
import { AiOutlineDelete, AiOutlineSlack } from 'react-icons/ai'
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space, Tooltip } from 'antd';
import { MdOutlineErrorOutline, MdOutlineSummarize } from "react-icons/md";
import { FaFile } from "react-icons/fa6";
import { IoArrowUpCircle } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";



export default function ChatWindow({ toggleSidebar, sidebarOpen }: { toggleSidebar: () => void, sidebarOpen: boolean }) {
    const { token } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>()
    const { messages, selectedPdf, conversations, conversationId, model, pdfUrl, titleConversation } = useSelector(
        (state: RootState) => state.chat,
    )
    const [input, setInput] = useState<string>('')
    const defaultLayoutPluginInstance = defaultLayoutPlugin()
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isTyping, setIsTyping] = useState(false);


    useEffect(() => {
        if (token) {
            getHistory().then(res => dispatch(setConversations(res.data)))
        }
    }, [token, dispatch])

    useEffect(() => {
        if (token && conversationId) {
            getMessageHistory(conversationId).then(res => dispatch(setMessages(res.data)))
        }
    }, [token, conversationId, dispatch])

    const handleSend = async () => {
        if (!selectedPdf || !token || !input.trim()) return

        // Thêm câu hỏi vào Redux ngay lập tức
        dispatch(addMessage({ content: input, is_user: true }))
        const userInput = input
        setInput('') // Xóa input ngay sau khi gửi
        setIsTyping(true); // Bắt đầu hiển thị hiệu ứng typing

        try {
            const res = await chat({
                pdf_id: selectedPdf,
                message: userInput,
                conversation_id: conversationId || undefined,
                model,
            })
            // Chỉ thêm câu trả lời từ AI sau khi nhận phản hồi
            dispatch(addMessage({ content: res.data.reply, is_user: false }))
            dispatch(setConversationId(res.data.conversation_id))
            dispatch(setPdfUrl(res.data.pdf_url))
        } catch (err) {
            console.error('Failed to send message:', err)
            dispatch(addMessage({ content: 'Error: Could not get response', is_user: false }))
        } finally {
            setIsTyping(false); // Ẩn hiệu ứng typing khi nhận phản hồi
        }

    }
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };
    // rút ngắn hội thại 
    const truncateTitle = (title: string, maxLength: number = 23) => {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength) + " ...";
    };
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Mở hộp thoại chọn file khi nhấp vào <p>
        }
    };

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
                message: "",
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
            dispatch(setTitleConversation(file.name));
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
    const handleSummarize = async () => {
        if (!conversationId) return;
        try {
            const loadingToastId = toast.loading("Đang tóm tắt...");
            const res = await summarizeConversation({ conversation_id: conversationId, model });
            dispatch(addMessage({ content: res.data.summary, is_user: false }));
            // Tải file Word
            const link = document.createElement('a');
            link.href = res.data.download_url;
            link.download = `summary_${conversationId}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.update(loadingToastId, {
                render: "Tóm tắt và tải thành công!",
                type: "success",
                isLoading: false,
                autoClose: 1300,
            });
        } catch (err) {
            console.error('Failed to summarize:', err);
            dispatch(addMessage({ content: 'Error: Could not summarize conversation', is_user: false }));
        }
    };
    return (
        <div className="h-full">
            {selectedPdf && conversationId ? (
                <div className=" h-full flex flex-col">
                    <div className="flex flex-1 h-full">

                        <div className="w-1/2 border-r flex-grow">
                            <div className="h-[7%]">
                                <div className="flex items-center h-full">
                                    {!sidebarOpen && (
                                        <div className="flex ml-2 items-center text-2xl text-neutral-700 font-bold space-x-4">
                                            <button onClick={toggleSidebar}>
                                                {sidebarOpen ? <HiMenuAlt3 /> : <HiMenuAlt2 />}
                                            </button>
                                        </div>
                                    )}
                                    <p className='text-[20px] font-medium ml-3 text-gray-800'>{titleConversation}</p>
                                </div>
                            </div>
                            {pdfUrl && token ? (
                                <div className="h-[93%] overflow-y-auto">
                                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                                        <Viewer
                                            key={`${conversationId}-${pdfUrl}`}
                                            fileUrl={pdfUrl}
                                            plugins={[defaultLayoutPluginInstance]}
                                            httpHeaders={{ Authorization: `Bearer ${token}` }} // Thêm token vào header
                                        />
                                    </Worker>
                                </div>
                            ) : (
                                <p className="text-gray-500">Select a conversation to view the PDF</p>
                            )}
                        </div>


                        <div className="w-1/2 flex flex-col">
                            <div className="h-[7%] flex items-center justify-between">
                                <div className="flex items-center">
                                    <p className='text-[18px] mx-3 font-medium'>Trò Chuyện</p>
                                    <ModeSelect />
                                </div>
                                <div className="mr-7 flex space-x-3 ">
                                    <Tooltip placement="bottomRight" title={'Tóm tắt cuộc trò chuyện'}>
                                        <button
                                            onClick={handleSummarize} disabled={!conversationId}
                                            className="flex items-center space-x-1 rounded-md bg-orange-400 p-[6px] hover:bg-orange-300"
                                        >

                                            <FaFileWord className="text-left text-white text-[20px]" />
                                            <p className='text-sm text-white pr-1 font-medium'>Tóm tắt</p>
                                        </button>
                                    </Tooltip>
                                    <Tooltip placement="bottomRight" title={'Xóa cuộc trò chuyện'}>
                                        <button
                                            onClick={() => confirmDelete(conversationId)}
                                            className="flex items-center"
                                        >

                                            <AiOutlineDelete className="text-left text-[23px]" />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`px-4 flex ${msg.is_user ? "justify-end" : "justify-start"}`}>
                                        {!msg.is_user && <AiOutlineSlack className="w-[30px] h-[30px] text-orange-400 mr-1 mt-2" />}
                                        <span className={`inline-block rounded-lg ${msg.is_user ? "bg-gray-200 text-white p-2" : "m-3"}`}>
                                            <AIResponse content={msg.content} isUser={msg.is_user} />
                                        </span>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="px-4 flex justify-start">
                                        <AiOutlineSlack className="w-[30px] h-[30px] text-orange-400 mr-1 mt-2" />
                                        <div className=" px-2 rounded-xl bg-gray-200 ">
                                            <span className="typing-animation">..</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>


                            <div className="flex space-x-2 mt-2 mb-1 mx-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    className="w-full p-2 border border-orange-400 text-sm outline-none rounded-md"
                                    placeholder="Type your message..."
                                    disabled={!selectedPdf}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}

                                />
                                <button
                                    onClick={handleSend}
                                    className=" px-4 bg-orange-400 text-white rounded-md hover:bg-orange-500"
                                    disabled={!selectedPdf}
                                >
                                    <LuSendHorizontal className='text-xl' />
                                </button>
                            </div>
                            <div className=" text-center text-[12px] text-gray-400 mb-1">ChatPDF có thể mắc lỗi. Hãy kiểm tra những thông tin quan trọng.</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full top-0 z-[-2] bg-amber-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
                    <div className="h-[8%]">
                        {!sidebarOpen && (
                            <div className="flex ml-2 h-full items-center text-2xl text-neutral-700 font-bold space-x-4">
                                <button onClick={toggleSidebar}>
                                    {sidebarOpen ? <HiMenuAlt3 /> : <HiMenuAlt2 />}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="h-[92%] w-full flex flex-col items-center justify-center">
                        <div className="flex items-center">
                            <h2 className='text-5xl font-bold px-3 pb-3'>Trò chuyện với bất kỳ </h2>
                            <div className=' rotate-3 text-white text-5xl px-3 py-2 font-bold bg-amber-500 rounded-xl'>PDF</div>

                        </div>
                        <p className='mt-3 text-center text-[17px]'>
                            Tham gia cùng hàng triệu <u className='text-amber-500'>sinh viên, nhà nghiên cứu và chuyên gia</u> để ngay lập tức <br />
                            giải đáp câu hỏi và hiểu tài liệu nghiên cứu với AI
                        </p>

                        <div className="mt-3 h-[50%] w-[60%] bg-amber-50 shadow-xl shadow-orange-100 rounded-2xl flex items-center justify-center">

                            <form onSubmit={handleFileUpload} className='h-full w-full flex items-center justify-center'>
                                <div className="h-[90%] w-[95%] border-dashed bg-orange-50 flex flex-col items-center justify-center border-amber-500 border-2 rounded-2xl
                                                hover:bg-orange-100
                                "
                                >
                                    <div className="relative w-[100px] h-[100px]"
                                        onClick={triggerFileInput}
                                    >
                                        <FaFile className='w-full h-full text-white' />
                                        <div className="absolute bottom-[-10px] right-[-10px] z-10">
                                            <IoArrowUpCircle className='text-5xl' />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden" // Ẩn hoàn toàn input
                                    />
                                    <p
                                        className="truncate-text cursor-pointer text-xl mt-5 font-medium"
                                        onClick={triggerFileInput}
                                        title={file ? file.name : "Chọn file PDF"} // Tooltip hiển thị tên đầy đủ
                                    >
                                        {file ? truncateTitle(file.name) : "Nhấn để tải hoặc kéo PDF vào đây"}
                                    </p>
                                    <button className='mt-5 flex items-center text-white justify-center w-[150px] h-[45px] bg-amber-500 rounded-xl hover:bg-amber-400'
                                        type="submit"
                                    >
                                        <IoArrowUpCircle className='text-2xl mr-2' />
                                        Tải PDF lên
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
