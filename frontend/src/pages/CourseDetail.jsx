import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import './CourseDetail.css';

const NOTE_ICONS = ['📝', '🔖', '💡', '🧠', '⭐', '📌', '🎯', '🔍'];

export default function CourseDetail() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourseAndNotes();
    }, [courseId]);

    const fetchCourseAndNotes = async () => {
        setLoading(true);
        setError(null);
        try {
            const [cRes, nRes] = await Promise.all([
                api.getCourse(courseId),
                api.getNotesByCourse(courseId)
            ]);
            if (!cRes.data) {
                navigate('/');
                return;
            }
            setCourse(cRes.data);
            setNotes(nRes.data);
        } catch (err) {
            console.error('Error fetching course or notes:', err);
            setError('Failed to load course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Delete this note?')) {
            await api.deleteNote(courseId, id);
            fetchCourseAndNotes();
        }
    };

    if (loading) return <div className="loading-state">Loading course...</div>;

    return (
        <div className="course-detail page-enter-active">
            {error && <div className="error-banner">{error}</div>}

            {/* ── Breadcrumb ── */}
            <nav className="breadcrumbs">
                <Link to="/dashboard" className="crumb-link">Home</Link>
                <span className="crumb-separator">›</span>
                <span className="crumb-current">{course.title}</span>
            </nav>

            {/* ── Course Banner ── */}
            <div className="course-banner">
                <div className="banner-icon-box">📚</div>
                <div className="banner-text">
                    <h2>{course.title}</h2>
                    {course.description && (
                        <p className="course-desc">{course.description}</p>
                    )}
                </div>
            </div>

            {/* ── Notes Section ── */}
            <div className="notes-section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 className="notes-section-title">Notes</h3>
                    <span className="notes-count-tag">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </span>
                </div>
                <Link to={`/courses/${courseId}/notes/new`} className="btn btn-primary" id="add-note-btn">
                    + Add Note
                </Link>
            </div>

            <div className="notes-list">
                {notes.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <h3>No notes yet</h3>
                        <p>Add your first note to start building your study materials.</p>
                    </div>
                ) : (
                    notes.map((note, idx) => (
                        <Link
                            to={`/courses/${courseId}/notes/${note.id}`}
                            key={note.id}
                            className="note-item animate-fade-in"
                            style={{ animationDelay: `${idx * 60}ms` }}
                        >
                            <div className="note-icon-box">
                                {NOTE_ICONS[idx % NOTE_ICONS.length]}
                            </div>
                            <div className="note-info">
                                <h3>{note.title}</h3>
                                <span className="note-date">
                                    Last updated: {new Date(note.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="note-actions">
                                {note.summary && <span className="ai-badge">✨ AI Summary</span>}
                                <button
                                    className="btn-danger-icon"
                                    onClick={(e) => handleDeleteNote(note.id, e)}
                                    title="Delete Note"
                                    id={`delete-note-${note.id}`}
                                >
                                    🗑
                                </button>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
