import { Link } from 'react-router-dom';
import ConnectionTest from '../components/common/ConnectionTest';

const featureCards = [
  {
    title: 'Structured Publishing',
    description: 'Draft, revise, and publish from one workspace with clear content states.',
  },
  {
    title: 'Creator Analytics',
    description: 'Track visible posts, categories, and publishing velocity without extra setup.',
  },
  {
    title: 'Fast Team Readiness',
    description: 'Use polished flows and clear hierarchy so the platform scales beyond a demo.',
  },
];

const workflowSteps = [
  'Create an account and move directly into your creator dashboard.',
  'Write posts with categories, status control, and visual cover support.',
  'Monitor post mix, draft backlog, and recent publishing activity.',
];

const launchSignals = [
  'No-code onboarding feel',
  'Publishing-ready dashboard',
  'Cleaner creator workflow',
];

const Home = () => {
  return (
    <>
      <section className="hero-section">
        <div className="shell-container hero-grid">
          <div className="hero-copy-block">
            <span className="eyebrow">Creator Operations Platform</span>
            <h1>Turn raw ideas into a clean, managed publishing pipeline.</h1>
            <p className="hero-copy">
              CreatorHub gives you a sharper home page, clearer dashboard workflow, and a more intentional UX for writing,
              reviewing, and scaling content output.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="hero-primary-cta">
                <span>Launch Workspace</span>
                <small>Create your account and start publishing</small>
              </Link>
              <Link to="/login" className="btn btn-outline px-6 py-3 hero-secondary-cta">
                Sign In
              </Link>
            </div>

            <div className="hero-signal-row">
              {launchSignals.map((signal) => (
                <span key={signal} className="hero-signal-pill">
                  {signal}
                </span>
              ))}
            </div>

            <div className="hero-metrics">
              <div className="metric-card">
                <strong>Faster setup</strong>
                <span>Cleaner onboarding and clearer next actions</span>
              </div>
              <div className="metric-card">
                <strong>Smarter dashboard</strong>
                <span>Filter, sort, and inspect content performance quickly</span>
              </div>
              <div className="metric-card">
                <strong>Better UI rhythm</strong>
                <span>Intentional spacing, contrast, hierarchy, and motion</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card__panel">
              <span className="eyebrow">Content Snapshot</span>
              <div className="hero-card__headline">
                <strong>Weekly publishing system</strong>
                <p>Manage draft flow, recent releases, and category balance from one place.</p>
              </div>
              <div className="hero-card__stats">
                <div>
                  <strong>03</strong>
                  <span>Core creator flows refined</span>
                </div>
                <div>
                  <strong>08</strong>
                  <span>Content categories supported</span>
                </div>
                <div>
                  <strong>01</strong>
                  <span>Sharper visual language</span>
                </div>
              </div>
            </div>
            <div className="hero-card__subpanel">
              <div>
                <strong>Built for creator teams</strong>
                <span>Give every post a clearer path from draft to publish.</span>
              </div>
              <div>
                <strong>Fast operational visibility</strong>
                <span>See what needs review and what is already performing.</span>
              </div>
            </div>
            <div className="hero-card__list">
              {workflowSteps.map((step) => (
                <div key={step} className="hero-card__list-item">
                  <span />
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="shell-container">
          <div className="section-heading">
            <span className="eyebrow">Why This Upgrade Matters</span>
            <h2>More than a visual refresh</h2>
            <p>
              The platform now feels like a product instead of a placeholder. The experience is clearer for new users and
              more useful for returning creators.
            </p>
          </div>

          <div className="feature-grid">
            {featureCards.map((feature) => (
              <article key={feature.title} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section page-section--tight">
        <div className="shell-container">
          <ConnectionTest />
        </div>
      </section>
    </>
  );
};

export default Home;
