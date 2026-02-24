import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import NoteEditor from './pages/NoteEditor';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container glass-panel">
        <header className="app-header">
          <div className="logo-container">
            <span className="logo-icon">🧠</span>
            <h1 className="logo-text">StudyBuddy</h1>
          </div>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/courses/:courseId/notes/:noteId" element={<NoteEditor />} />
            <Route path="/courses/:courseId/notes/new" element={<NoteEditor />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
