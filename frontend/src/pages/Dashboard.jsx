import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import './Dashboard.css';

// Deterministic gradient color per course index
const COURSE_ICONS = ['📚', '🎯', '🔬', '🖥️', '✏️', '🌍', '💡', '🧪', '📐', '🎨'];

export default function Dashboard() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.getCourses();
            setCourses(res.data);
        } catch (err) {
            console.error('Fetch courses error:', err);
            setError('Failed to load courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        try {
            await api.createCourse({ title: newTitle, description: newDesc });
            setNewTitle('');
            setNewDesc('');
            setModalOpen(false);
            fetchCourses();
        } catch (err) {
            console.error('Create course error:', err);
            alert('Failed to create course. Please try again.');
        }
    };

    const handleDeleteCourse = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Delete this course and all its notes?')) {
            try {
                await api.deleteCourse(id);
                fetchCourses();
            } catch (err) {
                console.error('Delete course error:', err);
                alert('Failed to delete course. Please try again.');
            }
        }
    };

    const firstName = user?.full_name?.split(' ')[0] || 'there';

    return (
        <div className="dashboard page-enter-active">
            {/* ── Welcome Banner ── */}
            <div className="dashboard-welcome">
                <div className="welcome-text">
                    <p className="greeting">Good day 👋</p>
                    <h2>Welcome back, <em>{firstName}</em>!</h2>
                    <p>Here are all your courses. Keep up the great work.</p>
                </div>
                <div className="welcome-stat-badges">
                    <div className="stat-badge">
                        <div className="stat-num">{courses.length}</div>
                        <div className="stat-label">Courses</div>
                    </div>
                </div>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* ── Section Header ── */}
            <div className="section-header">
                <div>
                    <h3 className="section-title">My Courses</h3>
                    {!loading && (
                        <p className="section-count">
                            {courses.length === 0
                                ? 'No courses yet – create your first one!'
                                : `${courses.length} course${courses.length !== 1 ? 's' : ''} in your workspace`}
                        </p>
                    )}
                </div>
                <button id="create-course-btn" className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    + New Course
                </button>
            </div>

            {/* ── Course Grid ── */}
            {loading ? (
                <div className="loading-grid">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
                </div>
            ) : (
                <div className="course-grid stagger">
                    {courses.map((c, idx) => (
                        <Link
                            to={`/courses/${c.id}`}
                            key={c.id}
                            className="course-card animate-fade-in-up"
                        >
                            <div className="course-content">
                                <div className="course-icon-box">
                                    {COURSE_ICONS[idx % COURSE_ICONS.length]}
                                </div>
                                <h3>{c.title}</h3>
                                <p>{c.description || 'No description provided.'}</p>
                            </div>
                            <div className="course-footer">
                                <span className="course-date">
                                    Created {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <div className="course-menu">
                                    <button
                                        className="btn-icon-danger"
                                        onClick={(e) => handleDeleteCourse(c.id, e)}
                                        title="Delete Course"
                                        id={`delete-course-${c.id}`}
                                    >
                                        🗑
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {courses.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">📂</div>
                            <h3>No courses yet</h3>
                            <p>Create your first course to start organizing your study materials.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── Create Course Modal ── */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-icon">📚</div>
                            <h3>Create New Course</h3>
                        </div>
                        <form className="modal-body" onSubmit={handleCreateCourse}>
                            <label className="field-label">
                                Course Title
                                <input
                                    id="new-course-title"
                                    className="input-field"
                                    placeholder="e.g., Operating Systems"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </label>
                            <label className="field-label">
                                Description <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                                <textarea
                                    id="new-course-desc"
                                    className="input-field"
                                    placeholder="Brief description of what you'll study..."
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                    rows={3}
                                />
                            </label>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" id="submit-course-btn" className="btn btn-primary">Create Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
