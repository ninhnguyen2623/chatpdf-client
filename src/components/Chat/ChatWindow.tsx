import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { chat, deleteConversation, getHistory, getMessageHistory, summarizeConversation, uploadPDF } from '../../services/api';
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
} from '../../store/chatSlice';
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';
import AIResponse from '../AIResponse';
import { toast } from 'react-toastify';
import { FaBriefcase, FaFileWord, FaFlaskVial, FaMicrophoneSlash, FaQuoteLeft, FaSquare } from 'react-icons/fa6';
import { HiMenuAlt2, HiMenuAlt3 } from 'react-icons/hi';
import ModeSelect from './ModeSelect';
import { AiOutlineDelete, AiOutlineSlack } from 'react-icons/ai';
import { Tooltip } from 'antd';
import { MdOutlineErrorOutline } from "react-icons/md";
import { FaFile, FaMicrophone } from "react-icons/fa6"; // Thêm icon mic
import { IoArrowUpCircle } from "react-icons/io5";
import { LuFileStack, LuSendHorizontal } from "react-icons/lu";
import AchievementsSection from '../AchievementsSection';
import uni1 from "../../assets/uni1.png";
import uni2 from "../../assets/uni2.png";
import uni3 from "../../assets/uni3.png";
import uni4 from "../../assets/uni4.png";
import uni5 from "../../assets/uni5.png";
import { FaGraduationCap } from "react-icons/fa6";
import { GrLanguage } from "react-icons/gr";
import Footer from '../Footer';
import CollapseInfo from '../CollapseInfo';
import './Chatwindow.css'

export default function ChatWindow({ toggleSidebar, sidebarOpen }: { toggleSidebar: () => void, sidebarOpen: boolean }) {
    const { token } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const { messages, selectedPdf, conversationId, model, pdfUrl, titleConversation } = useSelector(
        (state: RootState) => state.chat
    );
    const [input, setInput] = useState<string>('');
    const [isRecording, setIsRecording] = useState(false); // Trạng thái ghi âm
    const recognitionRef = useRef<SpeechRecognition | null>(null); // Ref cho SpeechRecognition
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    // const userName = localStorage.getItem('name') || 'My Account';

    useEffect(() => {
        if (token) {
            getHistory().then(res => dispatch(setConversations(res.data)));
        }
    }, [token, dispatch]);

    useEffect(() => {
        if (token && conversationId) {
            getMessageHistory(conversationId).then(res => dispatch(setMessages(res.data)));
        }
    }, [token, conversationId, dispatch]);

    // Khởi tạo SpeechRecognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // Chỉ ghi âm một lần
            recognitionRef.current.interimResults = false; // Không hiển thị kết quả tạm thời
            recognitionRef.current.lang = 'vi-VN'; // Ngôn ngữ mặc định (có thể thay đổi)

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript); // Điền văn bản vào input
                setIsRecording(false); // Tắt ghi âm sau khi có kết quả
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                toast.error('Không thể nhận diện giọng nói. Vui lòng thử lại.');
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false); // Đảm bảo trạng thái tắt khi ghi âm kết thúc
            };
        } else {
            console.warn('Trình duyệt không hỗ trợ Web Speech API');
            toast.warn('Trình duyệt của bạn không hỗ trợ nhập giọng nói.');
        }
    }, []);

    const handleSend = async () => {
        if (!selectedPdf || !token || !input.trim()) {
            toast.error("Vui lòng chọn PDF và nhập tin nhắn!");
            return;
        }

        dispatch(addMessage({ content: input, is_user: true }));
        const userInput = input;
        setInput('');
        setIsTyping(true);

        try {
            const res = await chat({
                pdf_id: selectedPdf,
                message: userInput,
                conversation_id: conversationId || undefined,
                model,
            });
            dispatch(addMessage({ content: res.data.reply, is_user: false }));
            dispatch(setConversationId(res.data.conversation_id));
            dispatch(setPdfUrl(res.data.pdf_url));
        } catch (err) {
            console.error('Failed to send message:', err);
            dispatch(addMessage({ content: 'Error: Could not get response', is_user: false }));
        } finally {
            setIsTyping(false);
        }
    };

    // Xử lý bật/tắt ghi âm
    const handleVoiceInput = () => {
        if (!recognitionRef.current) {
            toast.warn('Trình duyệt không hỗ trợ nhập giọng nói.');
            return;
        }
        if (isRecording) {
            recognitionRef.current.stop(); // Dừng ghi âm
        } else {
            setInput(''); // Xóa input hiện tại
            recognitionRef.current.start(); // Bắt đầu ghi âm
            setIsRecording(true);
            toast.info('Đang ghi âm... Nói câu hỏi của bạn.');
        }
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const truncateTitle = (title: string, maxLength: number = 23) => {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength) + " ...";
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
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
            if (fileInputRef.current) fileInputRef.current.value = "";
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
                        onClick={() => { handleDelete(conversationId); toast.dismiss(); }}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                    >
                        Xác nhận
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-200"
                    >
                        Hủy
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeButton: false,
                draggable: false,
            }
        );
    };

    const confirmAndSummarize = () => {
        const toastId = toast(
            () => (
                <div>
                    <div className='flex'>Bạn có chắc chắn muốn tóm tắt cuộc hội thoại này?</div>
                    <div className="flex space-x-2 mt-3 ml-5">
                        <button
                            onClick={async () => {
                                if (!conversationId) return;
                                toast.dismiss(toastId); // Ẩn confirm toast
                                const loadingToastId = toast.loading("Đang tóm tắt...");
                                try {
                                    const res = await summarizeConversation({ conversation_id: conversationId, model });
                                    dispatch(addMessage({ content: res.data.summary, is_user: false }));

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
                                    toast.update(loadingToastId, {
                                        render: "Lỗi khi tóm tắt cuộc hội thoại",
                                        type: "error",
                                        isLoading: false,
                                        autoClose: 1500,
                                    });
                                    dispatch(addMessage({ content: 'Error: Could not summarize conversation', is_user: false }));
                                }
                            }}
                            className="bg-orange-400 text-white px-2 py-1 rounded hover:bg-orange-300"
                        >
                            Xác nhận
                        </button>
                        <button
                            onClick={() => toast.dismiss(toastId)}
                            className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-200"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: false,
                closeButton: false,
                draggable: false,
            }
        );
    };

    return (
        <div className="h-full">
            {selectedPdf && conversationId ? (
                <div className="h-full flex flex-col">
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
                                            httpHeaders={{ Authorization: `Bearer ${token}` }}
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
                                            onClick={confirmAndSummarize}
                                            disabled={!conversationId}
                                            className="flex items-center space-x-1 rounded-md bg-orange-400 p-[6px] hover:bg-orange-300"
                                        >
                                            <FaFileWord className="text-left text-white text-[20px]" />
                                            <p className='text-sm text-white pr-1 font-medium'>Tóm tắt</p>
                                        </button>
                                    </Tooltip>
                                    <Tooltip placement="bottomRight" title={'Xóa cuộc trò chuyện'}>
                                        <button onClick={() => confirmDelete(conversationId)} className="flex items-center">
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
                                        <div className="px-2 rounded-xl bg-gray-200">
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
                                    placeholder="Type or speak your message..."
                                    disabled={!selectedPdf}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                {isTyping ? (
                                    <>
                                        <button
                                            className={`p-2 rounded-md ${isRecording ? 'bg-red-500 recording' : 'bg-orange-500'} text-white hover:bg-orange-300`}
                                            disabled={!selectedPdf}
                                        >
                                            <FaMicrophoneSlash className="text-xl" />
                                        </button>
                                        <button
                                            className="px-4 bg-orange-500 text-white rounded-md hover:bg-orange-300"
                                            disabled={!selectedPdf}
                                        >
                                            <FaSquare className='text-sm' />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleVoiceInput}
                                            className={`p-2 rounded-md ${isRecording ? 'bg-red-500 recording' : 'bg-orange-400'} text-white hover:bg-orange-500`}
                                            disabled={!selectedPdf}
                                        >
                                            <FaMicrophone className="text-xl" />
                                        </button>
                                        <button
                                            onClick={handleSend}
                                            className="px-4 bg-orange-400 text-white rounded-md hover:bg-orange-500"
                                            disabled={!selectedPdf}
                                        >
                                            <LuSendHorizontal className='text-xl' />
                                        </button>
                                    </>
                                )
                                }
                            </div>
                            <div className="text-center text-[12px] text-gray-400 mb-1">
                                ChatPDF có thể mắc lỗi. Hãy kiểm tra những thông tin quan trọng.
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="z-[-2]">
                    <div className="h-[40px] z-50 fixed top-0">
                        {!sidebarOpen && (
                            <div className="flex ml-2 h-full items-center text-2xl text-neutral-700 font-bold space-x-4">
                                <button onClick={toggleSidebar} className='mt-3'>
                                    {sidebarOpen ? <HiMenuAlt3 /> : <HiMenuAlt2 />}
                                </button>
                            </div>
                        )}
                    </div>
                    <AchievementsSection />
                    <div className="w-full flex flex-col items-center justify-center">
                        <div className="flex items-center">
                            <h2 className='text-5xl font-bold px-3 pb-3'>Trò chuyện với bất kỳ </h2>
                            <div className='rotate-3 text-white text-5xl px-3 py-2 font-bold bg-amber-500 rounded-xl'>PDF</div>
                        </div>
                        <p className='mt-10 text-center text-[17px]'>
                            Tham gia cùng hàng triệu <u className='text-amber-500'>sinh viên, nhà nghiên cứu và chuyên gia</u> để ngay lập tức <br />
                            giải đáp câu hỏi và hiểu tài liệu nghiên cứu với AI
                        </p>
                        <div className="mt-10 h-[320px] w-[60%] bg-amber-50 shadow-xl shadow-orange-100 rounded-2xl flex items-center justify-center">
                            <form onSubmit={handleFileUpload} className='h-full w-full flex items-center justify-center'>
                                <div className="h-[90%] w-[95%] border-dashed bg-orange-50 flex flex-col items-center justify-center border-amber-500 border-2 rounded-2xl hover:bg-orange-100">
                                    <div className="relative w-[100px] h-[100px]" onClick={triggerFileInput}>
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
                                        className="hidden"
                                    />
                                    <p
                                        className="truncate-text cursor-pointer text-xl mt-5 font-medium"
                                        onClick={triggerFileInput}
                                        title={file ? file.name : "Chọn file PDF"}
                                    >
                                        {file ? truncateTitle(file.name) : "Nhấn để tải hoặc kéo PDF vào đây"}
                                    </p>
                                    <button className='mt-5 flex items-center text-white justify-center w-[150px] h-[45px] bg-amber-500 rounded-xl hover:bg-amber-400' type="submit">
                                        <IoArrowUpCircle className='text-2xl mr-2' />
                                        Tải PDF lên
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="mt-20">
                            <p className='text-center text-xl text-gray-500'>Được tin dùng bởi sinh viên và nhà nghiên cứu từ các tổ chức hàng đầu</p>
                            <div className="">
                                <div className="flex items-center space-x-2 mt-3 justify-center">
                                    <img src={uni1} alt="uni1" width={150} />
                                    <img src={uni2} alt="uni1" width={200} />
                                    <img src={uni3} alt="uni1" width={200} />
                                </div>
                                <div className="flex item-center space-x-2 mt-5 justify-center">
                                    <img src={uni4} alt="uni1" width={270} height={50} />
                                    <img src={uni5} alt="uni1" width={200} />
                                </div>

                            </div>
                        </div>
                        <div className="mt-20 h-[250px] w-[70%] rounded-xl p-3 bg-orange-50">
                            <div className="mt-3">
                                <h3 className='text-center text-3xl font-medium'>" Nó giống như ChatGPT,</h3>
                                <h3 className='text-center text-3xl font-medium'>nhưng dành cho <span className='text-orange-400'>bài nghiên cứu</span>."</h3>
                            </div>
                            <div className="w-full flex items-center justify-center mt-7">
                                <div className="">
                                    <div className="flex items-center justify-center m-2">
                                        <img src="https://www.chatpdf.com/_static/twitter/profile/mushtaq_64x64.webp" alt="avata" className=' w-[40px] h-[40px] rounded-[50%]' />
                                    </div>
                                    <p className='text-sm text-center font-bold'>MushtaqBilalPhD</p>
                                    <p className='text-sm text-center text-gray-500'>@MushtaqBilalPhD</p>
                                </div>
                            </div>

                        </div>

                        <div className="mt-20">
                            <div className="space-y-5">
                                <h3 className=' text-center text-4xl font-medium'>ChatPDF một cách <span className='text-orange-400'>Ngắn gọn</span></h3>
                                <p className='text-xl text-center text-gray-500'>PDF AI của bạn - giống ChatGPT nhưng dành cho PDFs. Tóm tắt và trả lời câu hỏi miễn phí.</p>
                            </div>
                            <div className="mt-10">
                                <div className="flex space-x-5">
                                    <div className="w-[400px] h-[420px] p-6 rounded-xl border-1 shadow-md border-gray-200">
                                        <FaFlaskVial className='text-violet-500 text-xl' />
                                        <h3 className="font-medium text-xl my-2">Dành cho nhà nghiên cứu</h3>
                                        <p className="text-gray-500">
                                            Khám phá các bài báo khoa học, tài liệu học thuật và sách để lấy thông tin bạn cần cho nghiên cứu.
                                        </p>
                                        <div className="w-full mt-4 h-[220px] rounded-xl shadow-xl overflow-hidden">
                                            <img
                                                src="https://fastdo.vn/wp-content/uploads/2023/02/nghien-cuu-thi-truong-8.jpg"
                                                alt="Hình ảnh nghiên cứu thị trường"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-[400px] h-[420px] p-6 rounded-xl border-1 shadow-md border-gray-200">
                                        <FaGraduationCap className='text-green-500 text-xl' />
                                        <h3 className="font-medium text-xl my-2">Dành cho sinh viên</h3>
                                        <p className="text-gray-500">
                                            Học cho kỳ thi, nhận trợ giúp với bài tập, và trả lời câu hỏi trắc nghiệm nhanh hơn các sinh viên khác.
                                        </p>
                                        <div className="w-full mt-4 h-[220px] rounded-xl shadow-xl overflow-hidden">
                                            <img
                                                src="https://mkteer.vn/wp-content/uploads/2021/11/mkteer.vn-marketing-research.png"
                                                alt="Hình ảnh nghiên cứu marketing"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex mt-5 space-x-5">
                                    <div className="w-[400px] h-[420px] p-6 rounded-xl border-1 shadow-md border-gray-200">
                                        <FaBriefcase className='text-orange-500 text-xl' />
                                        <h3 className="font-medium text-xl my-2">Dành cho chuyên gia</h3>
                                        <p className="text-gray-500">
                                            Xử lý hợp đồng pháp lý, báo cáo tài chính, sổ tay và tài liệu đào tạo. Đặt câu hỏi về bất kỳ PDF nào để luôn cập nhật.
                                        </p>
                                        <div className="w-full mt-4 h-[220px] rounded-xl shadow-xl overflow-hidden">
                                            <img
                                                src="https://qtuupload.s3.ap-southeast-1.amazonaws.com/2024/09/Loi-ich-va-tac-tai-cua-viec-di-lam-them-cua-sinh-vien.jpg"
                                                alt="Hình ảnh lợi ích của việc làm thêm cho sinh viên"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-[400px] h-[420px] p-6 rounded-xl border-1 shadow-md border-gray-200">
                                        <FaQuoteLeft className='text-pink-500 text-xl' />
                                        <h3 className="font-medium text-xl my-2">Nguồn được trích dẫn</h3>
                                        <p className="text-gray-500">
                                            Trích dẫn được nhúng sẵn liên kết phản hồi đến các trang PDF gốc. Không cần phải tìm từng trang.
                                        </p>
                                        <div className="w-full mt-4 h-[220px] rounded-xl shadow-xl overflow-hidden">
                                            <img
                                                src="https://getdrive.net/wp-content/uploads/2020/04/Nghien-cuu-thi-truong.jpg"
                                                alt="Hình ảnh nghiên cứu thị trường"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex mt-5 space-x-5">
                                    <div className="w-[400px] h-[420px] p-6 rounded-xl border-1 shadow-md border-gray-200">
                                        <LuFileStack className='text-yellow-500 text-xl' />
                                        <h3 className="font-medium text-xl my-2">Trò chuyện với nhiều tiệp</h3>
                                        <p className="text-gray-500">
                                            Tạo thư mục để sắp xếp tệp của bạn và trò chuyện với nhiều PDF trong một cuộc trò chuyện duy nhất.
                                        </p>
                                        <div className="w-full mt-4 h-[220px] rounded-xl shadow-xl overflow-hidden">
                                            <img
                                                src="https://luanvan123.net/files/assets/de_tai_mau_mon_phuong_phap_nghien_cuu_khoa_hoc_luanvan123.jpg"
                                                alt="Hình ảnh đề tài nghiên cứu khoa học"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-[400px] h-[420px] p-6 rounded-xl border-1 shadow-md border-gray-200">
                                        <GrLanguage className='text-blue-500 text-xl' />
                                        <h3 className="font-medium text-xl my-2">Bất kỳ ngôn ngữ</h3>
                                        <p className="text-gray-500">
                                            Hoạt động trên toàn cầu! ChatPDF chấp nhận PDFs trong bất kỳ ngôn ngữ nào và có thể trò chuyện bằng bất kỳ ngôn ngữ nào.
                                        </p>
                                        <div className="w-full mt-4 h-[220px] rounded-xl shadow-xl overflow-hidden">
                                            <img
                                                src="https://adichthuat.com/wp-content/uploads/2021/07/ngon-ngu1.jpg"
                                                alt="Hình ảnh ngôn ngữ toàn cầu"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-20 h-[320px] w-[60%] bg-amber-50 shadow-xl shadow-orange-100 rounded-2xl flex items-center justify-center">
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
                        <div className="mt-20">
                            <div className="space-y-5">
                                <h3 className=' text-center text-4xl font-medium'>Tương tác với PDF trở lên <span className='text-orange-400'>Đơn giản</span></h3>
                                <p className='text-xl text-center text-gray-500'>Tóm tắt, so sánh và đặt câu hỏi cho bất kỳ PDF nào. Nhanh, miễn phí, không cần đăng ký.</p>
                            </div>
                            <div className="mt-10">
                                <div className="flex space-x-5">
                                    <div className="w-[400px] h-[420px] p-6 rounded-xl border-1 shadow-md border-gray-200">

                                        <div className="w-full h-[220px] rounded-xl shadow-xl overflow-hidden">
                                            <img
                                                src="https://asiasoft.com.vn/wp-content/uploads/2022/09/ky-nang-dieu-hanh-cuoc-hop.jpg"
                                                alt="Hình ảnh nghiên cứu thị trường"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className='text-yellow-500 text-md mt-4'>Tổ chức</p>
                                        <h3 className="font-medium text-xl my-2">Trò truyện với nhiều PDF</h3>
                                        <p className="text-gray-500">
                                            Đưa nhiều PDFs vào một cuộc trò chuyện. Giữ tài liệu học, bài nghiên cứu hoặc tệp dự án ở cùng một nơi.
                                        </p>
                                    </div>
                                    <div className="w-[400px] h-[420px] p-6 rounded-xl border-1 shadow-md border-gray-200">
                                        <div className="w-full h-[220px] rounded-xl shadow-xl overflow-hidden">
                                            <img
                                                src="https://asiasoft.com.vn/wp-content/uploads/2022/09/mau-phan-cong-cong-viec-7.jpg"
                                                alt="Hình ảnh nghiên cứu thị trường"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className='text-violet-500 text-md mt-4'>Đơn giản hóa</p>
                                        <h3 className="font-medium text-xl my-2">Trò truyện với nhiều PDF</h3>
                                        <p className="text-gray-500">
                                            Đưa nhiều PDFs vào một cuộc trò chuyện. Giữ tài liệu học, bài nghiên cứu hoặc tệp dự án ở cùng một nơi.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex mt-5 space-x-5">
                                    <div className="w-[400px] h-[420px] p-6 rounded-xl border-1 shadow-md border-gray-200">
                                        <div className="w-full h-[220px] rounded-xl shadow-xl overflow-hidden">
                                            <img
                                                src="https://png.pngtree.com/png-clipart/20240708/original/pngtree-flat-design-of-soft-skills-concept-png-image_15516351.png"
                                                alt="Hình ảnh nghiên cứu thị trường"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className='text-green-500 text-md mt-4'>Hiểu</p>
                                        <h3 className="font-medium text-xl my-2">Dịch PDF</h3>
                                        <p className="text-gray-500">
                                            Biến mọi PDF thành ngôn ngữ của bạn. Chuyển đổi tài liệu trên khắp thế giới thành văn bản rõ ràng, dễ hiểu ngay lập tức.
                                        </p>
                                    </div>
                                    <div className="w-[400px] h-[420px] p-6 rounded-xl border-1 shadow-md border-gray-200">
                                        <div className="w-full h-[220px] rounded-xl shadow-xl overflow-hidden">
                                            <img
                                                src="https://cdn1585.cdn4s4.io.vn//media/articles/528/content/cach-cai-thien-dieu-huong-website.jpg"
                                                alt="Hình ảnh nghiên cứu thị trường"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className='text-blue-500 text-md mt-4'>Điều hướng</p>
                                        <h3 className="font-medium text-xl my-2">Chế độ xem cạnh nhau</h3>
                                        <p className="text-gray-500">
                                            Giữ cửa sổ chat và PDF cạnh nhau. Câu trả lời được liên kết với nội dung gốc trong PDF, giúp dễ dàng kiểm chứng hoặc tìm hiểu thêm.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CollapseInfo />
                        <Footer />
                    </div>
                </div>
            )}
        </div>
    );
}