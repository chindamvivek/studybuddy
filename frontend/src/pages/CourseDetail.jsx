import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import './CourseDetail.css';

export default function CourseDetail() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourseAndNotes();
    }, [courseId]);

    const fetchCourseAndNotes = async () => {
        setLoading(true);
        const [cRes, nRes] = await Promise.all([
            api.getCourse(courseId),
            api.getNotesByCourse(courseId)
        ]);
        if (!cRes.data) {
            navigate('/'); // Course not found
            return;
        }
        setCourse(cRes.data);
        setNotes(nRes.data);
        setLoading(false);
    };

    const handleDeleteNote = async (id, e) => {
        e.preventDefault();
        if (window.confirm('Delete this note?')) {
            await api.deleteNote(courseId, id);
            fetchCourseAndNotes();
        }
    };

    if (loading) return <div className="loading-state">Loading course logic...</div>;

    return (
        <div className="course-detail page-enter-active">
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumbs">
                <Link to="/" className="crumb-link">Home</Link>
                <span className="crumb-separator">/</span>
                <span className="crumb-current">{course.title}</span>
            </nav>

            <div className="page-header">
                <div>
                    <h2 className="page-title">{course.title}</h2>
                    <p className="course-desc">{course.description}</p>
                </div>
                <Link to={`/courses/${courseId}/notes/new`} className="btn btn-primary">
                    + Add Note
                </Link>
            </div>

            <div className="notes-list">
                {notes.length === 0 ? (
                    <div className="empty-state">
                        <p>No notes in this course yet.</p>
                    </div>
                ) : (
                    notes.map(note => (
                        <Link to={`/courses/${courseId}/notes/${note.id}`} key={note.id} className="note-item glass-panel">
                            <div className="note-info">
                                <h3>{note.title}</h3>
                                <span className="date">Last updated: {new Date(note.updated_at).toLocaleDateString()}</span>
                            </div>
                            <div className="note-actions">
                                {note.summary && <span className="ai-badge">✨ AI Summarized</span>}
                                <button
                                    className="btn-danger-icon"
                                    onClick={(e) => handleDeleteNote(note.id, e)}
                                    title="Delete Note"
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
