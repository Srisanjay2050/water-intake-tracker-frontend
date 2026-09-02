import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="brand">💧 Water Intake Tracker</span>
      <div className="nav-links">
        {user.role === 'admin' ? (
          <>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/settings">Daily Goal</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Today</Link>
            <Link to="/history">History</Link>
          </>
        )}
        <span className="nav-user">
          {user.name} <span className="role-badge">{user.role}</span>
        </span>
        <button className="btn-link" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
