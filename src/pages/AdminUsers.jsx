import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await client.get('/users');
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeUser = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This removes their account and all intake logs.`)) {
      return;
    }
    setError('');
    setMessage('');
    try {
      await client.delete(`/users/${id}`);
      setMessage(`Deleted ${name}.`);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h1>Registered users</h1>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Total intake</th>
              <th>Entries</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u._id === me._id;
              return (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="role-badge">{u.role}</span>
                  </td>
                  <td>{u.intake.totalMl} ml</td>
                  <td>{u.intake.entryCount}</td>
                  <td className="row-actions">
                    <Link className="btn-link" to={`/admin/users/${u._id}`}>
                      History
                    </Link>
                    <button
                      className="btn-danger"
                      disabled={isSelf}
                      title={isSelf ? 'You cannot delete your own account' : ''}
                      onClick={() => removeUser(u._id, u.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
