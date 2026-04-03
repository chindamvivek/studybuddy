import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import './Auth.css';

export default function Signup() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await api.signup({
                full_name: fullName,
                email,
                password,
            });
            login(res.data);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error('Signup error:', err);
            const msg = err.response?.data?.error || 'Failed to create account. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            {/* ── Hero Side ── */}
            <div className="auth-hero">
                <div className="auth-hero-inner">
                    <div className="brand-logo">
                        <span className="brand-logo-icon">🧠</span>
                        <span className="brand-logo-text">StudyBuddy</span>
                    </div>
                    <span className="hero-pill">Set up your workspace</span>
                    <h1>Build your <em>personal</em><br />study hub.</h1>
                    <p>Create courses, capture notes, and let AI summarize the essentials for you — all in one place.</p>
                    <ul className="hero-features">
                        <li>
                            <span className="feat-icon">🚀</span>
                            Get started in under a minute
                        </li>
                        <li>
                            <span className="feat-icon">📝</span>
                            Markdown-powered note editor
                        </li>
                        <li>
                            <span className="feat-icon">🔒</span>
                            Private &amp; secure workspace
                        </li>
                    </ul>
                </div>
            </div>

            {/* ── Auth Panel ── */}
            <div className="auth-panel">
                <div className="auth-card">
                    <div className="auth-card-icon">✨</div>
                    <h2 className="auth-title">Create your account</h2>
                    <p className="auth-subtitle">It only takes a minute to get started.</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label className="field-label">
                            Full Name
                            <input
                                id="signup-fullname"
                                type="text"
                                className="input-field"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Alex Carter"
                                required
                            />
                        </label>
                        <label className="field-label">
                            Email
                            <input
                                id="signup-email"
                                type="email"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </label>
                        <label className="field-label">
                            Password
                            <input
                                id="signup-password"
                                type="password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Choose a strong password"
                                required
                            />
                        </label>
                        <button
                            id="signup-submit-btn"
                            type="submit"
                            className="btn btn-primary auth-submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating account…' : 'Get Started →'}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="link-primary">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
