import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the default loading message', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders a custom status message', () => {
    render(<LoadingSpinner message="Publishing your post..." />);

    expect(screen.getByText(/publishing your post/i)).toBeInTheDocument();
  });
});
