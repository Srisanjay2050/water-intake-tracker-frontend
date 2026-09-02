import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../api/client';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await client.get(`/users/${id}/intake`);
        if (active) setData(res.data);
      } catch (err) {
        if (active) setError(err.message);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="card">
        <p className="error">{error}</p>
        <Link className="btn-link" to="/admin/users">
          &larr; Back to users
        </Link>
      </div>
    );
  }
  if (!data) return <div className="card">Loading...</div>;

  return (
    <div className="stack">
      <div className="card">
        <Link className="btn-link" to="/admin/users">
          &larr; Back to users
        </Link>
        <h1>{data.user.name}</h1>
        <p className="muted">
          {data.user.email} - recommended goal {data.goalMl} ml/day
        </p>
      </div>

      <div className="card">
        <h2>Daily totals</h2>
        {data.history.length === 0 ? (
          <p className="muted">No intake logged.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Entries</th>
                  <th>Goal met</th>
                </tr>
              </thead>
              <tbody>
                {data.history.map((h) => (
                  <tr key={h.day}>
                    <td>{h.day}</td>
                    <td>{h.totalMl} ml</td>
                    <td>{h.entryCount}</td>
                    <td>{h.goalMet ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2>All entries</h2>
        {data.entries.length === 0 ? (
          <p className="muted">None.</p>
        ) : (
          <ul className="entry-list">
            {data.entries.map((entry) => (
              <li key={entry._id}>
                <span className="entry-amount">{entry.amountMl} ml</span>
                <span className="muted">{new Date(entry.loggedAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
