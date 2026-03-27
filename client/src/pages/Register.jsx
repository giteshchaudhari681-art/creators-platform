import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Alert, Button, Card, Input } from '../components/UI';
import { useForm } from '../hooks';
import api from '../services/api';
import { validateEmail, validateName, validatePassword } from '../utils/validation';

const Register = () => {
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const navigate = useNavigate();

  const { values, errors, isSubmitting, handleChange, handleSubmit: handleFormSubmit } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    async (formValues) => {
      setApiError('');
      setApiSuccess('');

      if (formValues.password !== formValues.confirmPassword) {
        const mismatch = 'Passwords do not match';
        setApiError(mismatch);
        toast.error(mismatch);
        throw new Error(mismatch);
      }

      try {
        const response = await api.post('/api/auth/register', {
          name: formValues.name.trim(),
          email: formValues.email.trim().toLowerCase(),
          password: formValues.password,
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Registration failed. Please try again.');
        }

        setApiSuccess('Account created successfully! Redirecting to login...');
        toast.success('Registration successful');

        setTimeout(() => {
          navigate('/login');
        }, 1600);
      } catch (error) {
        const message = error.message || 'Unable to connect to server. Please check your connection and try again.';
        setApiError(message);
        toast.error(message);
        throw error;
      }
    },
    {
      name: validateName,
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
        <div className="auth-showcase auth-showcase--warm">
          <span className="eyebrow">Build Your Presence</span>
          <h1>Create a creator workspace that feels more like a product than a starter template.</h1>
          <p>
            Sign up to write, preview, publish, and manage content inside a sharper interface with stronger UX defaults.
          </p>

          <div className="auth-showcase__metrics">
            <div>
              <strong>Publish Faster</strong>
              <span>Move from idea to post with less friction</span>
            </div>
            <div>
              <strong>Look Better</strong>
              <span>Stronger layout, rhythm, and interaction design</span>
            </div>
          </div>

          <div className="auth-showcase__list">
            <div>
              <strong>Publishing workspace</strong>
              <span>Draft, review, and release content with better structure.</span>
            </div>
            <div>
              <strong>Dashboard visibility</strong>
              <span>Track categories, draft volume, and recent post activity.</span>
            </div>
            <div>
              <strong>Interactive editor flow</strong>
              <span>Use cover previews, live reading stats, and cleaner forms.</span>
            </div>
          </div>
        </div>

        <Card className="auth-card">
          <div className="auth-card__head">
            <span className="eyebrow">Create Account</span>
            <h2>Join CreatorHub</h2>
            <p>Set up your account and move directly into the upgraded content workspace.</p>
          </div>

          {apiSuccess && (
            <Alert variant="success" title="Success">
              {apiSuccess}
            </Alert>
          )}

          {apiError && (
            <Alert variant="error" title="Registration Failed">
              {apiError}
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-4 auth-form">
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleFormChange}
              placeholder="John Doe"
              helperText="This is shown in your dashboard greeting."
              error={errors.name}
              disabled={isSubmitting}
              required
              inputClassName="auth-input"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleFormChange}
              placeholder="you@example.com"
              helperText="Use a real email if you plan to keep this account."
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
              placeholder="Minimum 6 characters"
              helperText="Choose a password you will remember."
              error={errors.password}
              disabled={isSubmitting}
              required
              inputClassName="auth-input"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={handleFormChange}
              placeholder="Re-enter your password"
              helperText="Repeat the same password exactly."
              error={errors.confirmPassword}
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
              loadingLabel="Creating Account..."
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Creator Account'}
            </Button>
          </form>

          <div className="auth-card__footer">
            <p>
              Already registered?{' '}
              <Link to="/login">Log in here</Link>
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Register;
