import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import api from '../services/api';

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../context/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe('Login page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form fields and submit button', () => {
    renderLogin();

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enter creatorhub/i })).toBeInTheDocument();
  });

  it('shows validation errors and does not submit an empty form', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /enter creatorhub/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('submits valid credentials to the API', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({
      data: {
        user: { id: '1', name: 'Alice' },
        token: 'token-123',
      },
    });

    renderLogin();

    await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /enter creatorhub/i }));

    expect(api.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(mockLogin).toHaveBeenCalledWith({ id: '1', name: 'Alice' }, 'token-123');
  });
});
