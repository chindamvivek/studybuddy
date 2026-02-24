import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const api = {
    // --- COURSES ---
    getCourses: async () => {
        return axios.get(`${BASE_URL}/courses`);
    },
    getCourse: async (id) => {
        return axios.get(`${BASE_URL}/courses/${id}`);
    },
    createCourse: async (courseData) => {
        return axios.post(`${BASE_URL}/courses`, courseData);
    },
    deleteCourse: async (id) => {
        return axios.delete(`${BASE_URL}/courses/${id}`);
    },

    // --- NOTES (Fully Nested Routes) ---
    getNotesByCourse: async (courseId) => {
        return axios.get(`${BASE_URL}/courses/${courseId}/notes`);
    },
    getNote: async (courseId, noteId) => {
        return axios.get(`${BASE_URL}/courses/${courseId}/notes/${noteId}`);
    },
    createNote: async (courseId, noteData) => {
        return axios.post(`${BASE_URL}/courses/${courseId}/notes`, noteData);
    },
    updateNote: async (courseId, noteId, noteData) => {
        return axios.put(`${BASE_URL}/courses/${courseId}/notes/${noteId}`, noteData);
    },
    deleteNote: async (courseId, noteId) => {
        return axios.delete(`${BASE_URL}/courses/${courseId}/notes/${noteId}`);
    },
    summarizeNote: async (courseId, noteId) => {
        return axios.post(`${BASE_URL}/courses/${courseId}/notes/${noteId}/summarize`);
    }
};
