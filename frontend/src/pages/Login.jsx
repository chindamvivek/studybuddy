import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import './Auth.css';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await api.login({ email, password });
            login(res.data);
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            const msg = err.response?.data?.error || 'Failed to log in. Please check your credentials.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <div className="auth-hero">
                <div className="auth-hero-inner">
                    <span className="hero-pill">Your AI-assisted study OS</span>
                    <h1>Stay organized, learn faster.</h1>
                    <p>StudyBuddy keeps your courses, notes, and AI summaries in one calm, structured workspace.</p>
                </div>
            </div>
            <div className="auth-panel">
                <div className="auth-card glass-panel">
                    <h2 className="auth-title">Welcome back</h2>
                    <p className="auth-subtitle">Log in to access your study workspace.</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label className="field-label">
                            Email
                            <input
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
                                type="password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </label>
                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        New to StudyBuddy?{' '}
                        <Link to="/signup" className="link-primary">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

