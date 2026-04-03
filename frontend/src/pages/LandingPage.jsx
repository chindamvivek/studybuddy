import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

/* ── Intersection Observer hook for scroll-reveal ── */
function useReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const targets = el.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return containerRef;
}

/* ── Data ── */
const FEATURES = [
  { icon: '📚', title: 'Organized Courses', desc: 'Group all your study materials into neat, color-coded courses. Find everything instantly.' },
  { icon: '✏️', title: 'Markdown Notes', desc: 'Write rich notes with headings, bullet points, code blocks, and more using full Markdown support.' },
  { icon: '✨', title: 'AI Summaries', desc: 'One click to generate a concise AI summary of any note — perfect for quick revision before exams.' },
  { icon: '🔍', title: 'Instant Search', desc: 'Jump to any course or note in seconds. Your entire workspace is always at your fingertips.' },
  { icon: '🔒', title: 'Private & Secure', desc: 'Your notes are yours. End-to-end private workspace that only you can access.' },
  { icon: '⚡', title: 'Blazing Fast', desc: 'Powered by modern web technology. Instant loads, smooth animations, zero lag.' },
];

const STEPS = [
  { num: '1', title: 'Create a Course', desc: 'Set up a course for any subject — Math, History, Programming, anything.' },
  { num: '2', title: 'Add Your Notes', desc: 'Write notes in beautiful Markdown with live preview right in the browser.' },
  { num: '3', title: 'Summarize with AI', desc: 'Hit Summarize and get a clean, structured bullet-point summary in seconds.' },
  { num: '4', title: 'Revise & Ace It', desc: 'Review AI summaries before exams and retain information more effectively.' },
];

const STATS = [
  { num: '50K+', label: 'Active Students' },
  { num: '2M+', label: 'Notes Created' },
  { num: '98%', label: 'Satisfaction Rate' },
  { num: '120+', label: 'Universities' },
];

const HERO_STATS = [
  { num: '50K+', label: 'Students' },
  { num: '2M+', label: 'Notes' },
  { num: '98%', label: 'Satisfaction' },
  { num: 'Free', label: 'To Start' },
];

const TESTIMONIALS = [
  {
    initial: 'A',
    name: 'Aanya Sharma',
    role: 'Engineering Student, IIT Delhi',
    text: 'StudyBuddy completely changed how I organize my semester. The AI summaries save me hours of revision time before every exam.',
    stars: 5,
  },
  {
    initial: 'R',
    name: 'Rahul Verma',
    role: 'Medical Student, AIIMS',
    text: 'I used to juggle 5 different apps for notes. Now it\'s all in one place, beautifully organized. The Markdown editor is a game changer.',
    stars: 5,
  },
  {
    initial: 'P',
    name: 'Priya Menon',
    role: 'MBA Student, ISB',
    text: 'The AI summary feature is incredible. I paste dense case study notes and get a crisp, bullet-point summary in seconds. Absolutely love it.',
    stars: 5,
  },
];

const PHOTOS = [
  { emoji: '📖', label: 'Deep Focus Study' },
  { emoji: '💻', label: 'Digital Learning' },
  { emoji: '👥', label: 'Group Sessions' },
  { emoji: '🧪', label: 'Lab Research' },
  { emoji: '📝', label: 'Active Note-taking' },
  { emoji: '🎓', label: 'Academic Excellence' },
];

export default function LandingPage() {
  const ref = useReveal();

  return (
    <div className="landing" ref={ref}>

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section className="hero">
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />
        <div className="hero-blob-3" />

        <div className="hero-badge">
          <span className="hero-badge-dot" />
          New · AI-Powered Study Workspace
        </div>

        <h1 className="hero-headline">
          Study <span className="gradient-text">smarter</span>,<br />
          not harder.
        </h1>

        <p className="hero-sub">
          StudyBuddy is the <strong>all-in-one study OS</strong> for students.
          Organize courses, write beautiful notes, and let <em>AI summarize</em> everything for you.
        </p>

        <div className="hero-ctas">
          <Link to="/signup" className="btn-hero-primary" id="hero-signup-btn">
            Start for Free →
          </Link>
          <Link to="/login" className="btn-hero-secondary" id="hero-login-btn">
            Log in
          </Link>
        </div>

        {/* Floating stat badges */}
        <div className="hero-stats">
          {HERO_STATS.map((s) => (
            <div className="stat-float-badge" key={s.label}>
              <div className="stat-float-num">{s.num}</div>
              <div className="stat-float-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* ══════════════════════════════ PHOTO GRID ══════════════════════════════ */}
      <section className="section photo-section">
        <div className="section-inner">
          <div className="section-center">
            <p className="section-label reveal">Students Everywhere</p>
            <h2 className="section-heading reveal reveal-delay-1">
              Built for <span className="accent">every kind</span> of learner
            </h2>
            <p className="section-desc reveal reveal-delay-2">
              From engineering to medicine, arts to business — StudyBuddy adapts to <em>your</em> learning style.
            </p>
          </div>

          <div className="photo-grid">
            {PHOTOS.map((p, i) => (
              <div
                className={`photo-card reveal reveal-delay-${(i % 3) + 1}`}
                key={i}
              >
                <div className="photo-placeholder">
                  <span>{p.emoji}</span>
                  <span className="photo-placeholder-label">{p.label}</span>
                </div>
                <div className="photo-card-overlay">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ FEATURES ══════════════════════════════ */}
      <section className="section features-section">
        <div className="section-inner">
          <p className="section-label reveal">Why StudyBuddy</p>
          <h2 className="section-heading reveal reveal-delay-1">
            Everything you need to <span className="accent">study better</span>
          </h2>
          <p className="section-desc reveal reveal-delay-2">
            Powerful features designed by students, <em>for students</em> — no bloat, just the essentials done perfectly.
          </p>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div
                className={`feature-card reveal reveal-delay-${(i % 3) + 1}`}
                key={f.title}
              >
                <div className="feature-icon-box">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ HOW IT WORKS ══════════════════════════════ */}
      <section className="section how-section">
        <div className="section-inner">
          <div className="section-center">
            <p className="section-label reveal">Simple Process</p>
            <h2 className="section-heading reveal reveal-delay-1">
              Up and running in <span className="accent">4 steps</span>
            </h2>
            <p className="section-desc reveal reveal-delay-2">
              No complex setup. Just create your workspace and start learning.
            </p>
          </div>

          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div
                className={`step-card reveal reveal-delay-${i + 1}`}
                key={s.num}
              >
                <div className="step-number">{s.num}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ STATS ══════════════════════════════ */}
      <section className="stats-section">
        <div className="section-inner">
          <div className="section-center" style={{ marginBottom: '2rem' }}>
            <p className="section-label reveal" style={{ color: 'rgba(189,221,255,0.7)' }}>By the Numbers</p>
            <h2 className="section-heading reveal reveal-delay-1" style={{ color: '#ffffff' }}>
              Trusted by <span style={{ background: 'linear-gradient(135deg, #BDDDFF, #88BDF2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>thousands</span> of students
            </h2>
          </div>

          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div className={`stat-item reveal reveal-delay-${i + 1}`} key={s.label}>
                <div className="stat-big-num">{s.num}</div>
                <div className="stat-big-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ TESTIMONIALS ══════════════════════════════ */}
      <section className="section testimonials-section">
        <div className="section-inner">
          <div className="section-center">
            <p className="section-label reveal">Student Love</p>
            <h2 className="section-heading reveal reveal-delay-1">
              What our <span className="accent">students say</span>
            </h2>
            <p className="section-desc reveal reveal-delay-2">
              Don't take our word for it — hear from students who transformed their study habits.
            </p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div
                className={`testimonial-card reveal reveal-delay-${i + 1}`}
                key={t.name}
              >
                <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initial}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CTA BANNER ══════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="reveal">Ready to study <em>smarter</em>?</h2>
          <p className="reveal reveal-delay-1">
            Join 50,000+ students who already use StudyBuddy to organize their courses,
            write better notes, and ace their exams.
          </p>
          <div className="reveal reveal-delay-2">
            <Link to="/signup" className="btn-hero-primary" id="cta-signup-btn">
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ FOOTER ══════════════════════════════ */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-top">
            {/* Brand column */}
            <div className="footer-brand">
              <div className="logo-text">🧠 StudyBuddy</div>
              <p>
                The AI-powered study workspace built for modern students.
                Organize, learn, and excel — all in one place.
              </p>
              <div className="footer-social">
                <a href="#" className="social-btn" title="Twitter">𝕏</a>
                <a href="#" className="social-btn" title="LinkedIn">in</a>
                <a href="#" className="social-btn" title="GitHub">⑂</a>
                <a href="#" className="social-btn" title="Discord">◈</a>
              </div>
            </div>

            {/* Product column */}
            <div className="footer-col">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><a href="#">Features</a></li>
                <li><a href="#">How It Works</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Changelog</a></li>
                <li><a href="#">Roadmap</a></li>
              </ul>
            </div>

            {/* Resources column */}
            <div className="footer-col">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Study Tips</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>

            {/* Company column */}
            <div className="footer-col">
              <h4>Company</h4>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">© 2025 StudyBuddy. All rights reserved. Made with ❤️ for students.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
