import { useState } from 'react';

const ConnectionTest = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/health');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message || 'Server connection is healthy.');
    } catch (err) {
      setError(`Failed to connect to the server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="status-panel">
      <div>
        <span className="eyebrow">Environment Check</span>
        <h3>Backend connectivity</h3>
        <p className="status-panel__copy">
          Validate the API before you start publishing or testing authentication flows.
        </p>
      </div>

      <button type="button" onClick={testConnection} disabled={loading} className="btn btn-primary px-5 py-3">
        {loading ? 'Testing Connection...' : 'Test API Connection'}
      </button>

      {message && <div className="status-panel__ok">Success: {message}</div>}
      {error && <div className="status-panel__error">Error: {error}</div>}

      <div className="status-panel__grid">
        <div>
          <strong>Backend</strong>
          <span>`/api/health` via proxy</span>
        </div>
        <div>
          <strong>Frontend</strong>
          <span>Vite client experience</span>
        </div>
        <div>
          <strong>Usage</strong>
          <span>Safe to test before deeper flows</span>
        </div>
      </div>
    </section>
  );
};

export default ConnectionTest;
