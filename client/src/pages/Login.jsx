import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Alert, Button, Card, Input } from '../components/UI';
import { useAuth } from '../context/useAuth';
import { useForm } from '../hooks';
import api from '../services/api';
import { validateEmail, validatePassword } from '../utils/validation';

const Login = () => {
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const { values, errors, isSubmitting, handleChange, handleSubmit: handleFormSubmit } = useForm(
    { email: '', password: '' },
    async (formValues) => {
      setApiError('');
      setApiSuccess('');

      try {
        const response = await api.post('/api/auth/login', {
          email: formValues.email.trim().toLowerCase(),
          password: formValues.password,
        });

        setApiSuccess('Login successful! Redirecting...');
        toast.success('Login successful');
        login(response.data.user, response.data.token);

        setTimeout(() => {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }, 500);
      } catch (error) {
        const message = error.response?.data?.message || 'Unable to connect to the server. Please try again.';
        setApiError(message);
        toast.error(message);
        throw error;
      }
    },
    {
      email: validateEmail,
      password: validatePassword,
    }
  );

  const handleFormChange = (event) => {
    handleChange(event);
    if (apiError) setApiError('');
    if (apiSuccess) setApiSuccess('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await handleFormSubmit(event);
  };

  return (
    <section className="auth-page">
      <div className="shell-container auth-grid">
        <div className="auth-showcase">
          <span className="eyebrow">Return To Workspace</span>
          <h1>Log in and pick up your publishing flow where you left it.</h1>
          <p>
            Access your creator dashboard, continue drafts, and manage post performance from a cleaner interface.
          </p>

          <div className="auth-showcase__metrics">
            <div>
              <strong>Dashboard</strong>
              <span>Filters, insights, and post control</span>
            </div>
            <div>
              <strong>Editor</strong>
              <span>Live preview and sharper publishing flow</span>
            </div>
          </div>

          <div className="auth-showcase__list">
            <div>
              <strong>Focused workflow</strong>
              <span>Clear hierarchy and faster next actions after sign-in.</span>
            </div>
            <div>
              <strong>Live content control</strong>
              <span>Move from edits to publishing without losing context.</span>
            </div>
            <div>
              <strong>Better workspace signal</strong>
              <span>Stats, filters, previews, and improved navigation.</span>
            </div>
          </div>
        </div>

        <Card className="auth-card">
          <div className="auth-card__head">
            <span className="eyebrow">Sign In</span>
            <h2>Welcome back</h2>
            <p>Use your account credentials to enter the creator workspace.</p>
          </div>

          {apiError && (
            <Alert variant="error" title="Login Failed">
              {apiError}
            </Alert>
          )}

          {apiSuccess && (
            <Alert variant="success" title="Success">
              {apiSuccess}
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-4 auth-form">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleFormChange}
              placeholder="you@example.com"
              helperText="Use the same email you registered with."
              error={errors.email}
              disabled={isSubmitting}
              required
              inputClassName="auth-input"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleFormChange}
              placeholder="Enter your password"
              helperText="Passwords are stored securely and cannot be recovered from the UI."
              error={errors.password}
              disabled={isSubmitting}
              required
              inputClassName="auth-input"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full auth-submit"
              loading={isSubmitting}
              loadingLabel="Signing In..."
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Enter CreatorHub'}
            </Button>
          </form>

          <div className="auth-card__footer">
            <p>
              No account yet?{' '}
              <Link to="/register">Create one now</Link>
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Login;
