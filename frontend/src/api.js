// Mock API for Frontend Development Phase
// We will replace this with real axios calls later.

let courses = [
    { id: 1, title: 'Operating Systems', description: 'Concepts of modern OS, memory management, and processes.', created_at: new Date().toISOString() },
    { id: 2, title: 'UI/UX Design', description: 'Principles of creating beautiful and functional user interfaces.', created_at: new Date().toISOString() }
];

let notes = [
    { id: 1, course_id: 1, title: 'Memory Management', content: '# Memory Management\n\n- Paging\n- Segmentation\n- Virtual Memory', summary: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, course_id: 2, title: 'Color Theory Basics', content: 'Understanding the color wheel, harmony, and contrast.', summary: 'The note covers basic concepts like color wheel and contrast.', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

export const api = {
    // --- COURSES ---
    getCourses: async () => {
        return new Promise(resolve => setTimeout(() => resolve({ data: courses }), 300));
    },
    getCourse: async (id) => {
        const course = courses.find(c => c.id === parseInt(id));
        return new Promise(resolve => setTimeout(() => resolve({ data: course }), 200));
    },
    createCourse: async (courseData) => {
        const newCourse = { ...courseData, id: Date.now(), created_at: new Date().toISOString() };
        courses.push(newCourse);
        return new Promise(resolve => setTimeout(() => resolve({ data: newCourse }), 400));
    },
    deleteCourse: async (id) => {
        courses = courses.filter(c => c.id !== parseInt(id));
        notes = notes.filter(n => n.course_id !== parseInt(id)); // Cascade delete manual mock
        return new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 300));
    },

    // --- NOTES ---
    getNotesByCourse: async (courseId) => {
        const courseNotes = notes.filter(n => n.course_id === parseInt(courseId));
        return new Promise(resolve => setTimeout(() => resolve({ data: courseNotes }), 300));
    },
    getNote: async (id) => {
        const note = notes.find(n => n.id === parseInt(id));
        return new Promise(resolve => setTimeout(() => resolve({ data: note }), 200));
    },
    createNote: async (courseId, noteData) => {
        const newNote = { ...noteData, course_id: parseInt(courseId), id: Date.now(), summary: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        notes.push(newNote);
        return new Promise(resolve => setTimeout(() => resolve({ data: newNote }), 400));
    },
    updateNote: async (id, noteData) => {
        let updatedNote = null;
        notes = notes.map(n => {
            if (n.id === parseInt(id)) {
                updatedNote = { ...n, ...noteData, updated_at: new Date().toISOString() };
                return updatedNote;
            }
            return n;
        });
        return new Promise(resolve => setTimeout(() => resolve({ data: updatedNote }), 400));
    },
    deleteNote: async (id) => {
        notes = notes.filter(n => n.id !== parseInt(id));
        return new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 300));
    },
    summarizeNote: async (id) => {
        // Mocking an AI call
        return new Promise(resolve => setTimeout(() => {
            let updatedNote = null;
            notes = notes.map(n => {
                if (n.id === parseInt(id)) {
                    updatedNote = { ...n, summary: `**AI Summary:** This is a mock AI summary for ${n.title}. The real backend will call a free LLM API to generate this based on your note content.` };
                    return updatedNote;
                }
                return n;
            });
            resolve({ data: updatedNote.summary });
        }, 1500));
    }
};
