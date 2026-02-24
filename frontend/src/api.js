import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({
    baseURL: BASE_URL,
});

client.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('studybuddy_user');
        if (stored) {
            try {
                const user = JSON.parse(stored);
                if (user && user.id) {
                    config.headers['x-user-id'] = user.id;
                }
            } catch {
                // ignore parse errors
            }
        }
    }
    return config;
});

export const api = {
    // --- AUTH ---
    signup: async (data) => client.post('/auth/signup', data),
    login: async (data) => client.post('/auth/login', data),

    // --- COURSES ---
    getCourses: async () => client.get('/courses'),
    getCourse: async (id) => client.get(`/courses/${id}`),
    createCourse: async (courseData) => client.post('/courses', courseData),
    deleteCourse: async (id) => client.delete(`/courses/${id}`),

    // --- NOTES (Fully Nested Routes) ---
    getNotesByCourse: async (courseId) => client.get(`/courses/${courseId}/notes`),
    getNote: async (courseId, noteId) => client.get(`/courses/${courseId}/notes/${noteId}`),
    createNote: async (courseId, noteData) => client.post(`/courses/${courseId}/notes`, noteData),
    updateNote: async (courseId, noteId, noteData) => client.put(`/courses/${courseId}/notes/${noteId}`, noteData),
    deleteNote: async (courseId, noteId) => client.delete(`/courses/${courseId}/notes/${noteId}`),
    summarizeNote: async (courseId, noteId) => client.post(`/courses/${courseId}/notes/${noteId}/summarize`),
};
