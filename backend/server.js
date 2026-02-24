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
// COURSE ROUTES
// ==========================================

// Get all courses
app.get('/api/courses', (req, res) => {
    try {
        const courses = db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single course by ID
app.get('/api/courses/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid course id' });
    }
    try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new course
app.post('/api/courses', (req, res) => {
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
        const stmt = db.prepare('INSERT INTO courses (title, description) VALUES (?, ?)');
        const info = stmt.run(title, description);
        const newCourse = db.prepare('SELECT * FROM courses WHERE id = ?').get(info.lastInsertRowid);
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a course
app.put('/api/courses/:id', (req, res) => {
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
        const stmt = db.prepare('UPDATE courses SET title = ?, description = ? WHERE id = ?');
        const info = stmt.run(title, description, id);
        if (info.changes === 0) return res.status(404).json({ error: 'Course not found' });

        const updatedCourse = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a course
app.delete('/api/courses/:id', (req, res) => {
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
    const courseId = Number(req.params.courseId);
    if (!Number.isInteger(courseId) || courseId <= 0) {
        return res.status(400).json({ error: 'Invalid course id' });
    }
    try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const notes = db.prepare('SELECT * FROM notes WHERE course_id = ? ORDER BY updated_at DESC').all(courseId);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific note within a course
app.get('/api/courses/:courseId/notes/:noteId', (req, res) => {
    try {
        const note = db.prepare('SELECT * FROM notes WHERE id = ? AND course_id = ?').get(req.params.noteId, req.params.courseId);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new note within a course
app.post('/api/courses/:courseId/notes', (req, res) => {
    const { title, content } = req.body;
    const { courseId } = req.params;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    try {
        const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
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
    const { title, content } = req.body;
    const { courseId, noteId } = req.params;

    try {
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
    const { courseId, noteId } = req.params;
    try {
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
    const { courseId, noteId } = req.params;

    try {
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
