import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import NoteEditor from './pages/NoteEditor';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

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
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="logo-container">
            <span className="logo-icon">🧠</span>
            <Link to="/" className="logo-text">StudyBuddy</Link>
          </div>
          <div className="header-actions">
            {user ? (
              <>
                <div className="user-pill">
                  <span className="user-avatar">{user.full_name?.charAt(0)?.toUpperCase() || 'U'}</span>
                  <div className="user-meta">
                    <span className="user-name">{user.full_name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="link-muted">Log in</Link>
                <Link to="/signup" className="btn btn-primary">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/courses/:courseId"
            element={
              <RequireAuth>
                <CourseDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/courses/:courseId/notes/:noteId"
            element={
              <RequireAuth>
                <NoteEditor />
              </RequireAuth>
            }
          />
          <Route
            path="/courses/:courseId/notes/new"
            element={
              <RequireAuth>
                <NoteEditor />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
        </Routes>
      </main>
    </div>
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
