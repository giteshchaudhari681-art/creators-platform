import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

const mockLogout = jest.fn();
const mockIsAuthenticated = jest.fn();

jest.mock('../../context/useAuth', () => ({
  useAuth: () => ({
    user: mockIsAuthenticated() ? { name: 'Alice' } : null,
    logout: mockLogout,
    isAuthenticated: mockIsAuthenticated,
  }),
}));

const renderHeader = () =>
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows guest navigation links and primary CTA when logged out', () => {
    mockIsAuthenticated.mockReturnValue(false);

    renderHeader();

    expect(screen.getByRole('link', { name: /creatorhub home/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByText(/start free/i)).toBeInTheDocument();
  });

  it('shows authenticated navigation and user details when logged in', () => {
    mockIsAuthenticated.mockReturnValue(true);

    renderHeader();

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });

  it('calls logout when the user clicks the log out button', async () => {
    const user = userEvent.setup();
    mockIsAuthenticated.mockReturnValue(true);

    renderHeader();
    await user.click(screen.getByRole('button', { name: /log out/i }));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
