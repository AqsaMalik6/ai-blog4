import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Adjust if needed

export const api = axios.create({
    baseURL: API_BASE_URL,
});

export interface Blog {
    id: number;
    topic: string;
    content: string;
    timestamp: string;
}

export interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    image_url?: string;
    created_at: string;
}

export interface Chat {
    id: number;
    title: string;
    created_at: string;
}

export const blogApi = {
    getAll: async (): Promise<Blog[]> => {
        const res = await api.get('/blogs');
        return res.data;
    },
    generate: async (topic: string, chatId?: number) => {
        const res = await api.post('/generate-blog', { topic, chat_id: chatId });
        return res.data;
    },
};

export const chatApi = {
    getAll: async (): Promise<Chat[]> => {
        const res = await api.get('/chats');
        return res.data;
    },
    getMessages: async (chatId: number): Promise<Message[]> => {
        const res = await api.get(`/chats/${chatId}/messages`);
        return res.data;
    },
    delete: async (chatId: number) => {
        await api.delete(`/chats/${chatId}`);
    }
};
