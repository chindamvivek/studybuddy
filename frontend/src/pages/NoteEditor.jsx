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

    const [aiError, setAiError] = useState(null);

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [summarizing, setSummarizing] = useState(false);
    const [activeTab, setActiveTab] = useState('write');

    useEffect(() => {
        fetchData();
    }, [courseId, noteId]);

    const fetchData = async () => {
        try {
            const [cRes] = await Promise.all([api.getCourse(courseId)]);
            setCourse(cRes.data);

            if (!isNew) {
                const nRes = await api.getNote(courseId, noteId);
                if (nRes.data) {
                    setTitle(nRes.data.title);
                    setContent(nRes.data.content);
                    setSummary(nRes.data.summary);
                }
            }
        } catch (error) {
            console.error('Error fetching note data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Title is required');
            return;
        }
        setSaving(true);
        try {
            if (isNew) {
                const res = await api.createNote(courseId, { title, content });
                navigate(`/courses/${courseId}/notes/${res.data.id}`);
            } else {
                await api.updateNote(courseId, noteId, { title, content });
            }
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSummarize = async () => {
        if (isNew) {
            alert('Please save the note first before summarizing.');
            return;
        }
        setAiError(null);
        setSummarizing(true);
        try {
            const res = await api.summarizeNote(courseId, noteId);
            setSummary(res.data.summary);
        } catch (error) {
            console.error('Error summarizing note:', error);
            const apiMessage = error?.response?.data?.error;
            const apiDetails = error?.response?.data?.details;
            if (apiMessage && apiDetails) {
                setAiError(`${apiMessage} ${apiDetails}`);
            } else {
                setAiError(apiMessage || apiDetails || 'Failed to summarize note. Please try again.');
            }
        } finally {
            setSummarizing(false);
        }
    };

    if (loading || !course) return <div className="loading-state">Loading note editor...</div>;

    return (
        <div className="note-editor page-enter-active">
            {/* ── Breadcrumb ── */}
            <nav className="breadcrumbs">
                <Link to="/dashboard" className="crumb-link">Home</Link>
                <span className="crumb-separator">›</span>
                <Link to={`/courses/${courseId}`} className="crumb-link">{course.title}</Link>
                <span className="crumb-separator">›</span>
                <span className="crumb-current">{isNew ? 'New Note' : title || 'Untitled Note'}</span>
            </nav>

            {/* ── Editor Header ── */}
            <div className="editor-header">
                <input
                    id="note-title-input"
                    className="note-title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title..."
                    autoFocus={isNew}
                />
                <div className="editor-actions">
                    <button
                        className="btn btn-ghost"
                        onClick={() => setActiveTab(activeTab === 'write' ? 'preview' : 'write')}
                    >
                        {activeTab === 'write' ? '👁 Preview' : '✏️ Edit'}
                    </button>
                    <button
                        id="save-note-btn"
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : isNew ? '💾 Save Note' : '💾 Save Changes'}
                    </button>
                </div>
            </div>

            {aiError && <div className="error-banner">{aiError}</div>}

            {/* ── Two-Column Body ── */}
            <div className="editor-body">
                {/* Left: Editor / Preview */}
                <div className="editor-workspace">
                    <div className="editor-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'write' ? 'active' : ''}`}
                            onClick={() => setActiveTab('write')}
                        >
                            ✏️ Write
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('preview')}
                        >
                            👁 Preview
                        </button>
                    </div>

                    <div className="editor-content-area">
                        {activeTab === 'write' ? (
                            <textarea
                                id="note-content-textarea"
                                className="markdown-textarea"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder={`Start typing your study notes here using Markdown...\n\n# Heading 1\n## Heading 2\n- Bullet point\n**bold** and *italic* text`}
                            />
                        ) : (
                            <div className="markdown-preview markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                                    {content || '*Nothing to preview yet...*'}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: AI Sidebar */}
                <aside className="ai-sidebar">
                    <div className="ai-panel">
                        <div className="ai-panel-header">
                            <div className="ai-panel-icon">🧠</div>
                            <div>
                                <div className="ai-panel-title">AI Summary</div>
                                <div className="ai-panel-subtitle">Powered by Gemini</div>
                            </div>
                        </div>

                        {!isNew ? (
                            <button
                                id="generate-summary-btn"
                                className={`btn-generate ${summarizing ? 'loading' : ''}`}
                                onClick={handleSummarize}
                                disabled={summarizing}
                            >
                                {summarizing ? (
                                    <>⏳ Generating Summary...</>
                                ) : (
                                    <>✨ Generate Summary</>
                                )}
                            </button>
                        ) : (
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Save the note first to enable AI summarization.
                            </p>
                        )}

                        {summary && (
                            <div className="ai-summary-result">
                                <div className="ai-summary-result-header">
                                    ✨ Summary
                                </div>
                                <div className="markdown-body">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                                        {summary}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pro Tips */}
                    <div className="tips-panel">
                        <div className="tips-panel-title">💡 Pro Tips</div>
                        <ul className="tips-list">
                            <li>Use <strong># Heading</strong> for better structure</li>
                            <li><strong>**bold**</strong> for key terms, <em>*italic*</em> for emphasis</li>
                            <li>Use <code>- list items</code> for bullet points</li>
                            <li>Save often, then generate AI summaries for quick revision</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
