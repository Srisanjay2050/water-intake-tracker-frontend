import { Fragment, useCallback, useEffect, useState } from 'react';
import client from '../api/client';

export default function History() {
  const [history, setHistory] = useState([]);
  const [openDay, setOpenDay] = useState(null);
  const [dayEntries, setDayEntries] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const loadHistory = useCallback(async () => {
    setError('');
    try {
      const { data } = await client.get('/intake/history');
      setHistory(data.history);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const openDayEntries = async (day) => {
    const { data } = await client.get(`/intake/day/${day}`);
    setDayEntries(data.entries);
  };

  const toggleDay = async (day) => {
    setError('');
    if (openDay === day) {
      setOpenDay(null);
      setDayEntries([]);
      return;
    }
    try {
      await openDayEntries(day);
      setOpenDay(day);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeEntry = async (id) => {
    setError('');
    try {
      await client.delete(`/intake/${id}`);
      await loadHistory();
      if (openDay) await openDayEntries(openDay);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h1>Intake history</h1>
      {error && <p className="error">{error}</p>}
      {loaded && history.length === 0 ? (
        <p className="muted">No history yet. Log some water on the Today page.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total</th>
                <th>Goal</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <Fragment key={row.day}>
                  <tr>
                    <td>{row.day}</td>
                    <td>{row.totalMl} ml</td>
                    <td>{row.goalMl} ml</td>
                    <td>{row.goalMet ? '✅ Met' : '—'}</td>
                    <td>
                      <button className="btn-link" onClick={() => toggleDay(row.day)}>
                        {openDay === row.day ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {openDay === row.day && (
                    <tr>
                      <td colSpan={5}>
                        <ul className="entry-list">
                          {dayEntries.map((entry) => (
                            <li key={entry._id}>
                              <span className="entry-amount">{entry.amountMl} ml</span>
                              <span className="muted">
                                {new Date(entry.loggedAt).toLocaleString()}
                              </span>
                              <button className="btn-danger" onClick={() => removeEntry(entry._id)}>
                                Delete
                              </button>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
