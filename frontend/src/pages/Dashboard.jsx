import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import './Dashboard.css';

export default function Dashboard() {
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
            console.error("Fetch courses error:", err);
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
            alert("Failed to create course. Please try again.");
        }
    };

    const handleDeleteCourse = async (id, e) => {
        e.preventDefault();
        if (window.confirm('Delete this course and all its notes?')) {
            try {
                await api.deleteCourse(id);
                fetchCourses();
            } catch (err) {
                console.error('Delete course error:', err);
                alert("Failed to delete course. Please try again.");
            }
        }
    };

    return (
        <div className="dashboard page-enter-active">
            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}
            <div className="page-header">
                <div>
                    <h2 className="page-title">My Courses</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Organize your study materials efficiently.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    + Create Course
                </button>
            </div>

            <div className="course-grid">
                {loading && (
                    <div className="loading-state">
                        Loading courses...
                    </div>
                )}
                {courses.map(c => (
                    <Link to={`/courses/${c.id}`} key={c.id} className="course-card glass-panel">
                        <div className="course-content">
                            <h3>{c.title}</h3>
                            <p>{c.description || 'No description provided.'}</p>
                        </div>
                        <div className="course-actions">
                            <span className="date">Created {new Date(c.created_at).toLocaleDateString()}</span>
                            <button
                                className="btn-danger-icon"
                                onClick={(e) => handleDeleteCourse(c.id, e)}
                                title="Delete Course"
                            >
                                🗑
                            </button>
                        </div>
                    </Link>
                ))}
                {courses.length === 0 && (
                    <div className="empty-state">
                        <p>No courses found. Create one to get started!</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content glass-panel animate-fade-in" onClick={e => e.stopPropagation()}>
                        <h3>Create New Course</h3>
                        <form onSubmit={handleCreateCourse}>
                            <input
                                className="input-field"
                                placeholder="Course Title (e.g., Operating Systems)"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                autoFocus
                                required
                            />
                            <textarea
                                className="input-field"
                                placeholder="Brief description..."
                                value={newDesc}
                                onChange={e => setNewDesc(e.target.value)}
                                rows={3}
                            />
                            <div className="modal-actions">
                                <button type="button" className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
