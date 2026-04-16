import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialFormData = {
  email: '',
  password: '',
};

const LoginForm = ({ onSubmit = () => {} }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedEmail = formData.email.trim();
    const password = formData.password;

    if (!trimmedEmail || !password) {
      setError('Email and password are required.');
      return;
    }

    setError('');
    onSubmit({
      email: trimmedEmail,
      password,
    });
  };

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <div style={heroStyle}>
          <span style={badgeStyle}>Creator Access</span>
          <h1 style={titleStyle}>Login</h1>
          <p style={subtitleStyle}>Sign in to manage your creator dashboard and campaigns.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate style={formStyle}>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="creator@example.com"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />

          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
          />

          {error ? (
            <p role="alert" style={errorStyle}>
              {error}
            </p>
          ) : null}

          <button type="submit" style={buttonStyle}>
            Sign In
          </button>
        </form>

        <p style={linkTextStyle}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={linkStyle}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '80vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  background:
    'radial-gradient(circle at top, rgba(16, 185, 129, 0.18), transparent 28%), linear-gradient(135deg, #f4efe6 0%, #f7fbf9 100%)',
};

const panelStyle = {
  width: '100%',
  maxWidth: '420px',
  padding: '2.5rem',
  borderRadius: '24px',
  backgroundColor: '#fffdf8',
  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12)',
  border: '1px solid rgba(15, 23, 42, 0.08)',
};

const heroStyle = {
  marginBottom: '1.75rem',
};

const badgeStyle = {
  display: 'inline-block',
  marginBottom: '0.75rem',
  padding: '0.35rem 0.75rem',
  borderRadius: '999px',
  backgroundColor: '#d1fae5',
  color: '#065f46',
  fontSize: '0.85rem',
  fontWeight: 700,
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
};

const titleStyle = {
  margin: 0,
  color: '#0f172a',
  fontSize: '2rem',
};

const subtitleStyle = {
  marginTop: '0.65rem',
  marginBottom: 0,
  color: '#475569',
  lineHeight: 1.5,
};

const formStyle = {
  display: 'grid',
  gap: '0.85rem',
};

const labelStyle = {
  color: '#1e293b',
  fontWeight: 600,
};

const inputStyle = {
  padding: '0.9rem 1rem',
  borderRadius: '14px',
  border: '1px solid #cbd5e1',
  fontSize: '1rem',
  outline: 'none',
};

const errorStyle = {
  margin: 0,
  padding: '0.85rem 1rem',
  borderRadius: '12px',
  backgroundColor: '#fef2f2',
  color: '#b91c1c',
  border: '1px solid #fecaca',
};

const buttonStyle = {
  marginTop: '0.5rem',
  padding: '0.95rem 1rem',
  border: 'none',
  borderRadius: '14px',
  background: 'linear-gradient(135deg, #0f766e 0%, #16a34a 100%)',
  color: '#ffffff',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const linkTextStyle = {
  marginTop: '1.5rem',
  marginBottom: 0,
  textAlign: 'center',
  color: '#475569',
};

const linkStyle = {
  color: '#0f766e',
  fontWeight: 700,
  textDecoration: 'none',
};

export default LoginForm;
