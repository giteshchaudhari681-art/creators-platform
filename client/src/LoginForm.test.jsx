import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';

const renderLoginForm = (props = {}) =>
  render(
    <MemoryRouter>
      <LoginForm {...props} />
    </MemoryRouter>
  );

describe('LoginForm', () => {
  it('updates the email and password fields when the user types', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'creator@example.com');
    await user.type(passwordInput, 'StrongPassword123');

    expect(emailInput).toHaveValue('creator@example.com');
    expect(passwordInput).toHaveValue('StrongPassword123');
  });

  it('submits the entered credentials on the happy path', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    renderLoginForm({ onSubmit: handleSubmit });

    await user.type(screen.getByLabelText(/email/i), 'creator@example.com');
    await user.type(screen.getByLabelText(/password/i), 'StrongPassword123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(handleSubmit).toHaveBeenCalled();
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'creator@example.com',
      password: 'StrongPassword123',
    });
  });

  it('shows a validation error and blocks submission when fields are empty', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    renderLoginForm({ onSubmit: handleSubmit });

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/email and password are required/i);
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
