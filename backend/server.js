import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initDb } from './db.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// ==========================================
// AUTH ROUTES (NO HASHING / TOKENS)
// ==========================================

const sanitizeUser = (user) => ({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
});

// Signup
app.post('/api/auth/signup', (req, res) => {
    const { full_name, email, password } = req.body;

    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
        return res.status(400).json({ error: 'Full name is required' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ error: 'Email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    try {
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim());
        if (existing) {
            return res.status(409).json({ error: 'Email is already registered' });
        }

        const stmt = db.prepare('INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)');
        const info = stmt.run(full_name.trim(), email.trim(), password);
        const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
        res.status(201).json(sanitizeUser(newUser));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ error: 'Email is required' });
    }
    if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: 'Password is required' });
    }

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim());
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.json(sanitizeUser(user));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper to read user id from header
const getUserIdFromHeader = (req) => {
    const raw = req.header('x-user-id');
    const id = Number(raw);
    if (!raw || !Number.isInteger(id) || id <= 0) {
        return null;
    }
    return id;
};

// ==========================================
// COURSE ROUTES
// ==========================================

// Get all courses
app.get('/api/courses', (req, res) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    try {
        const courses = db.prepare('SELECT * FROM courses WHERE user_id = ? ORDER BY created_at DESC').all(userId);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single course by ID
app.get('/api/courses/:id', (req, res) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid course id' });
    }
    try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ? AND user_id = ?').get(id, userId);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new course
app.post('/api/courses', (req, res) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    const { title, description } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
    }
    if (title.length > 200) {
        return res.status(400).json({ error: 'Title is too long (max 200 characters)' });
    }
    if (description && description.length > 1000) {
        return res.status(400).json({ error: 'Description is too long (max 1000 characters)' });
    }

    try {
        const stmt = db.prepare('INSERT INTO courses (user_id, title, description) VALUES (?, ?, ?)');
        const info = stmt.run(userId, title, description);
        const newCourse = db.prepare('SELECT * FROM courses WHERE id = ? AND user_id = ?').get(info.lastInsertRowid, userId);
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a course
app.put('/api/courses/:id', (req, res) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid course id' });
    }
    const { title, description } = req.body;
    if (title && (typeof title !== 'string' || !title.trim())) {
        return res.status(400).json({ error: 'Title, if provided, must be a non-empty string' });
    }
    if (title && title.length > 200) {
        return res.status(400).json({ error: 'Title is too long (max 200 characters)' });
    }
    if (description && description.length > 1000) {
        return res.status(400).json({ error: 'Description is too long (max 1000 characters)' });
    }
    try {
        const stmt = db.prepare('UPDATE courses SET title = ?, description = ? WHERE id = ? AND user_id = ?');
        const info = stmt.run(title, description, id, userId);
        if (info.changes === 0) return res.status(404).json({ error: 'Course not found' });

        const updatedCourse = db.prepare('SELECT * FROM courses WHERE id = ? AND user_id = ?').get(id, userId);
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a course
app.delete('/api/courses/:id', (req, res) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid course id' });
    }
    try {
        const stmt = db.prepare('DELETE FROM courses WHERE id = ?');
        const info = stmt.run(id);
        if (info.changes === 0) return res.status(404).json({ error: 'Course not found' });
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// NOTE ROUTES (Fully Nested)
// ==========================================

// Get all notes for a specific course
app.get('/api/courses/:courseId/notes', (req, res) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    const courseId = Number(req.params.courseId);
    if (!Number.isInteger(courseId) || courseId <= 0) {
        return res.status(400).json({ error: 'Invalid course id' });
    }
    try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ? AND user_id = ?').get(courseId, userId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const notes = db.prepare('SELECT * FROM notes WHERE course_id = ? ORDER BY updated_at DESC').all(courseId);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific note within a course
app.get('/api/courses/:courseId/notes/:noteId', (req, res) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    const courseId = Number(req.params.courseId);
    if (!Number.isInteger(courseId) || courseId <= 0) {
        return res.status(400).json({ error: 'Invalid course id' });
    }
    try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ? AND user_id = ?').get(courseId, userId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const note = db.prepare('SELECT * FROM notes WHERE id = ? AND course_id = ?').get(req.params.noteId, courseId);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new note within a course
app.post('/api/courses/:courseId/notes', (req, res) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    const { title, content } = req.body;
    const { courseId } = req.params;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ? AND user_id = ?').get(courseId, userId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const stmt = db.prepare('INSERT INTO notes (course_id, title, content) VALUES (?, ?, ?)');
        const info = stmt.run(courseId, title, content);
        const newNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(info.lastInsertRowid);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a specific note within a course
app.put('/api/courses/:courseId/notes/:noteId', (req, res) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    const { title, content } = req.body;
    const { courseId, noteId } = req.params;

    try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ? AND user_id = ?').get(courseId, userId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const stmt = db.prepare(`
      UPDATE notes 
      SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND course_id = ?
    `);
        const info = stmt.run(title, content, noteId, courseId);
        if (info.changes === 0) return res.status(404).json({ error: 'Note not found or does not belong to this course' });

        const updatedNote = db.prepare('SELECT * FROM notes WHERE id = ?').get(noteId);
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a specific note within a course
app.delete('/api/courses/:courseId/notes/:noteId', (req, res) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    const { courseId, noteId } = req.params;
    try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ? AND user_id = ?').get(courseId, userId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const stmt = db.prepare('DELETE FROM notes WHERE id = ? AND course_id = ?');
        const info = stmt.run(noteId, courseId);
        if (info.changes === 0) return res.status(404).json({ error: 'Note not found or does not belong to this course' });
        res.json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// AI SUMMARIZATION (MOCK OR REAL)
// ==========================================

app.post('/api/courses/:courseId/notes/:noteId/summarize', async (req, res, next) => {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
        return res.status(401).json({ error: 'Missing or invalid user id' });
    }
    const { courseId, noteId } = req.params;

    try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ? AND user_id = ?').get(courseId, userId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const note = db.prepare('SELECT * FROM notes WHERE id = ? AND course_id = ?').get(noteId, courseId);
        if (!note) return res.status(404).json({ error: 'Note not found or does not belong to this course' });
        if (!note.content) return res.status(400).json({ error: 'Note content is empty. Cannot summarize.' });

        // Mock AI Call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockSummary = `### AI Summary: ${note.title}\nHere are the key takeaways from this note:\n- The content primarily discusses core concepts related to this topic.\n- Ensure you review the main bullet points before the exam.\n- **Note length:** ${note.content.length} characters analyzed.\n\n*(Note: This is an automated summary generated by the StudyBuddy LLM integration)*`;

        const stmt = db.prepare('UPDATE notes SET summary = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(mockSummary, noteId);

        res.json({ summary: mockSummary });
    } catch (error) {
        next(error);
    }
});

// Global error handler (fallback for uncaught errors)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: 'Internal server error' });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
