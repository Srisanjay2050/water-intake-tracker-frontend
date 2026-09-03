import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="brand">
        <span className="brand-drop" aria-hidden="true" />
        Water Intake Tracker
      </span>
      <div className="nav-links">
        {user && user.role === 'admin' && (
          <>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/settings">Daily Goal</Link>
          </>
        )}
        {user && user.role !== 'admin' && (
          <>
            <Link to="/dashboard">Today</Link>
            <Link to="/history">History</Link>
          </>
        )}
        {user && (
          <span className="nav-user">
            {user.name} <span className="role-badge">{user.role}</span>
          </span>
        )}
        <ThemeToggle />
        {user && (
          <button className="btn-link" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
