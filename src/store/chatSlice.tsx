// store/chatSlice.tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    content: string;
    is_user: boolean;
    model_used?: 'gemini' | 'deepseek' | 'llama' | 'qwen'; // Cập nhật model_used
    created_at?: string;
}

interface Conversation {
    id: number;
    title: string;
    created_at: string;
    pdf: number;
}

interface PDF {
    id: number;
    title: string;
    uploaded_at: string;
}

interface ChatState {
    conversations: Conversation[];
    titleConversation: string;
    messages: Message[];
    selectedPdf: number | null;
    conversationId: number | null;
    model: 'gemini' | 'deepseek' | 'llama' | 'qwen'; // Cập nhật model
    pdfs: PDF[];
    pdfUrl: string | null;
}

const initialState: ChatState = {
    conversations: [],
    titleConversation: "",
    messages: [],
    selectedPdf: null,
    conversationId: null,
    model: 'gemini', // Mặc định vẫn là 'gemini'
    pdfs: [],
    pdfUrl: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setConversations: (state, action: PayloadAction<Conversation[]>) => {
            state.conversations = action.payload;
        },
        setTitleConversation: (state, action: PayloadAction<string | "">) => {
            state.titleConversation = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        setSelectedPdf: (state, action: PayloadAction<number | null>) => {
            state.selectedPdf = action.payload;
        },
        setConversationId: (state, action: PayloadAction<number | null>) => {
            state.conversationId = action.payload;
        },
        setModel: (state, action: PayloadAction<'gemini' | 'deepseek' | 'llama' | 'qwen'>) => { // Cập nhật kiểu của setModel
            state.model = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        setPdfs: (state, action: PayloadAction<PDF[]>) => {
            state.pdfs = action.payload;
        },
        addConversation: (state, action: PayloadAction<Conversation>) => {
            state.conversations.push(action.payload);
        },
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        setPdfUrl: (state, action: PayloadAction<string | null>) => {
            state.pdfUrl = action.payload;
        },
        deleteConversation: (state, action: PayloadAction<number>) => {
            state.conversations = state.conversations.filter(conv => conv.id !== action.payload);
            if (state.conversationId === action.payload) {
                state.conversationId = null;
                state.selectedPdf = null;
                state.pdfUrl = null;
                state.messages = [];
            }
        },
        updateConversation: (state, action: PayloadAction<{ id: number; title: string }>) => {
            const conv = state.conversations.find(conv => conv.id === action.payload.id);
            if (conv) {
                conv.title = action.payload.title;
            }
        },
    },
});

export const {
    setConversations,
    setTitleConversation,
    addMessage,
    setSelectedPdf,
    setConversationId,
    setModel,
    clearMessages,
    setPdfs,
    addConversation,
    setMessages,
    setPdfUrl,
    deleteConversation,
    updateConversation,
} = chatSlice.actions;

export default chatSlice.reducer;