import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import NoteEditor from './pages/NoteEditor';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

/* ── Auth guards ── */
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

/* ── Main Router Shell ── */
function AppShell() {
  const { user, logout } = useAuth();

  return (
    <Routes>
      {/* Landing page — its own layout (full-width, no main-content padding) */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className="app-shell">
              <header className="app-header">
                <div className="app-header-inner">
                  <Link to="/" className="logo-container">
                    <span className="logo-icon">🧠</span>
                    <span className="logo-text">StudyBuddy</span>
                  </Link>
                  <div className="auth-links">
                    <Link to="/login" className="link-muted">Log in</Link>
                    <Link to="/signup" className="btn btn-primary">Get Started</Link>
                  </div>
                </div>
              </header>
              <main style={{ flex: 1 }}>
                <LandingPage />
              </main>
            </div>
          )
        }
      />

      {/* Auth pages — their own full-screen layout */}
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />

      {/* Authenticated app pages — shared header + padded main */}
      <Route
        path="*"
        element={
          <div className="app-shell">
            <header className="app-header">
              <div className="app-header-inner">
                <Link to={user ? '/dashboard' : '/'} className="logo-container">
                  <span className="logo-icon">🧠</span>
                  <span className="logo-text">StudyBuddy</span>
                </Link>
                <div className="header-actions">
                  {user ? (
                    <>
                      <div className="user-pill">
                        <span className="user-avatar">
                          {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                        <div className="user-meta">
                          <span className="user-name">{user.full_name}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                      <button className="btn-logout" onClick={logout}>Logout</button>
                    </>
                  ) : (
                    <div className="auth-links">
                      <Link to="/login" className="link-muted">Log in</Link>
                      <Link to="/signup" className="btn btn-primary">Get Started</Link>
                    </div>
                  )}
                </div>
              </div>
            </header>
            <main className="main-content">
              <Routes>
                <Route
                  path="/dashboard"
                  element={<RequireAuth><Dashboard /></RequireAuth>}
                />
                <Route
                  path="/courses/:courseId"
                  element={<RequireAuth><CourseDetail /></RequireAuth>}
                />
                <Route
                  path="/courses/:courseId/notes/:noteId"
                  element={<RequireAuth><NoteEditor /></RequireAuth>}
                />
                <Route
                  path="/courses/:courseId/notes/new"
                  element={<RequireAuth><NoteEditor /></RequireAuth>}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
