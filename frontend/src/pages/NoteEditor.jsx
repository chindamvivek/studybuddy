import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '../api';
import './NoteEditor.css';

export default function NoteEditor() {
    const { courseId, noteId } = useParams();
    const navigate = useNavigate();
    const isNew = !noteId;

    const [course, setCourse] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [summary, setSummary] = useState(null);

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [summarizing, setSummarizing] = useState(false);
    const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'

    useEffect(() => {
        fetchData();
    }, [courseId, noteId]);

    const fetchData = async () => {
        const cRes = await api.getCourse(courseId);
        setCourse(cRes.data);

        if (!isNew) {
            const nRes = await api.getNote(noteId);
            if (nRes.data) {
                setTitle(nRes.data.title);
                setContent(nRes.data.content);
                setSummary(nRes.data.summary);
            }
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Title is required');
            return;
        }
        setSaving(true);
        if (isNew) {
            const res = await api.createNote(courseId, { title, content });
            navigate(`/courses/${courseId}/notes/${res.data.id}`);
        } else {
            await api.updateNote(noteId, { title, content });
        }
        setSaving(false);
    };

    const handleSummarize = async () => {
        if (isNew) {
            alert('Please save the note first before summarizing.');
            return;
        }
        setSummarizing(true);
        const res = await api.summarizeNote(noteId);
        setSummary(res.data);
        setSummarizing(false);
    };

    if (loading || !course) return <div className="loading-state">Loading note editor...</div>;

    return (
        <div className="note-editor page-enter-active">
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumbs">
                <Link to="/" className="crumb-link">Home</Link>
                <span className="crumb-separator">/</span>
                <Link to={`/courses/${courseId}`} className="crumb-link">{course.title}</Link>
                <span className="crumb-separator">/</span>
                <span className="crumb-current">{isNew ? 'New Note' : title || 'Untitled Note'}</span>
            </nav>

            <div className="editor-header">
                <input
                    className="note-title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title..."
                    autoFocus={isNew}
                />
                <div className="editor-actions">
                    {!isNew && (
                        <button
                            className={`btn btn-magic ${summarizing ? 'loading' : ''}`}
                            onClick={handleSummarize}
                            disabled={summarizing}
                        >
                            {summarizing ? '✨ Summarizing...' : '✨ Summarize Note'}
                        </button>
                    )}
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* AI Summary Display */}
            {summary && (
                <div className="ai-summary-box glass-panel animate-fade-in">
                    <div className="summary-header">
                        <span className="sparkle-icon">✨</span>
                        <h4>AI Generated Summary</h4>
                    </div>
                    <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
                    </div>
                </div>
            )}

            {/* Editor Body */}
            <div className="editor-workspace glass-panel">
                <div className="editor-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'write' ? 'active' : ''}`}
                        onClick={() => setActiveTab('write')}
                    >
                        Write (Markdown)
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Preview
                    </button>
                </div>

                <div className="editor-content-area">
                    {activeTab === 'write' ? (
                        <textarea
                            className="markdown-textarea"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Start typing your study notes here using markdown...&#10;&#10;# Heading 1&#10;## Heading 2&#10;- Bullet point"
                        />
                    ) : (
                        <div className="markdown-preview markdown-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content || '*Nothing to preview...*'}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
