import axios, { AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

interface AuthResponse {
    refresh: string;
    access: string;
}

interface ChatResponse {
    reply: string;
    conversation_id: number;
    pdf_url: string;
}

interface Conversation {
    id: number;
    title: string;
    created_at: string;
    pdf: number;
    pdfUrl?: string;
}

interface PDF {
    id: number;
    title: string;
    uploaded_at: string;
}

interface Message {
    id: number;
    content: string;
    is_user: boolean;
    model_used: 'gemini' | 'deepseek' | 'llama' | 'qwen';
    created_at: string;
}

export const register = (data: { username: string; email: string; password: string }): Promise<AxiosResponse> =>
    api.post('/register/', data);

export const login = (data: { email: string; password: string }): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/login/', data);

export const uploadPDF = (formData: FormData): Promise<AxiosResponse<{ message: string; id: number }>> =>
    api.post('/upload-pdf/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const deleteConversation = (conversationId: number): Promise<AxiosResponse> =>
    api.delete(`/history/${conversationId}/`);

export const updateConversation = (conversationId: number, title: string): Promise<AxiosResponse> =>
    api.patch(`/history/${conversationId}/`, { title });

export const chat = (data: {
    pdf_id: number;
    message: string;
    conversation_id?: number;
    model: 'gemini' | 'deepseek' | 'llama' | 'qwen';
    title?: string;
}): Promise<AxiosResponse<ChatResponse>> => api.post('/chat/', data);

export const getHistory = (): Promise<AxiosResponse<Conversation[]>> => api.get('/history/');

export const getMessageHistory = (conversationId: number): Promise<AxiosResponse<Message[]>> =>
    api.get(`/history/${conversationId}/messages/`);

export const summarizeConversation = (data: {
    conversation_id: number;
    model: 'gemini' | 'deepseek' | 'llama' | 'gemma';
}): Promise<AxiosResponse<{ summary: string; conversation_id: number; download_url: string }>> =>
    api.post('/summary/', data);