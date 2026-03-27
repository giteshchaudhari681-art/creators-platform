import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard', authOnly: true },
  { to: '/create', label: 'Create', authOnly: true },
  { to: '/login', label: 'Login', guestOnly: true },
  { to: '/register', label: 'Register', guestOnly: true },
];

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const loggedIn = isAuthenticated();

  return (
    <header className="site-header">
      <div className="shell-container site-header__inner">
        <Link to="/" className="brand-mark" aria-label="CreatorHub home">
          <span className="brand-mark__badge">CH</span>
          <span>
            <strong>CreatorHub</strong>
            <small>Build, publish, and track content faster</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {navItems
            .filter((item) => {
              if (item.authOnly) return loggedIn;
              if (item.guestOnly) return !loggedIn;
              return true;
            })
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
        </nav>

        <div className="site-header__actions">
          {loggedIn ? (
            <>
              <div className="user-pill">
                <span className="user-pill__avatar">
                  {(user?.name || 'U').slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <strong>{user?.name}</strong>
                  <small>Creator workspace</small>
                </div>
              </div>
              <button type="button" onClick={logout} className="btn btn-outline px-4 py-2">
                Log Out
              </button>
            </>
          ) : (
            <Link to="/register" className="header-cta">
              <span>Start Free</span>
              <small>Open creator workspace</small>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
