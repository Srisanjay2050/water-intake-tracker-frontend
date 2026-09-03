import { useCallback, useEffect, useState } from 'react';
import client from '../api/client';

const QUICK_ADD = [250, 500, 750];

export default function Dashboard() {
  const [today, setToday] = useState(null);
  const [custom, setCustom] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await client.get('/intake/today');
      setToday(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addIntake = async (amountMl) => {
    setError('');
    setBusy(true);
    try {
      await client.post('/intake', { amountMl });
      setCustom('');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const addCustom = (e) => {
    e.preventDefault();
    const amount = Number(custom);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter an amount greater than 0.');
      return;
    }
    addIntake(amount);
  };

  const removeEntry = async (id) => {
    setError('');
    try {
      await client.delete(`/intake/${id}`);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!today) {
    return <div className="card">{error ? <p className="error">{error}</p> : 'Loading...'}</div>;
  }

  const pct = Math.min(today.percent, 100);
  const goalReached = today.totalMl >= today.goalMl;

  const R = 60;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference * (1 - pct / 100);

  const prettyDate = new Date(`${today.day}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="stack">
      <div className="card">
        <div className="page-head">
          <h1>Today</h1>
          <p className="page-date">{prettyDate}</p>
        </div>
        <div className="ring-wrap">
          <svg className="ring" viewBox="0 0 144 144" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <circle className="ring-track" cx="72" cy="72" r={R} />
            <circle
              className={`ring-value ${goalReached ? 'is-full' : ''}`}
              cx="72"
              cy="72"
              r={R}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 72 72)"
            />
            <text className="ring-center" x="72" y="78" textAnchor="middle">{pct}%</text>
          </svg>
          <div className="ring-meta">
            <p className="big">
              {today.totalMl} ml <span className="muted">/ {today.goalMl} ml</span>
            </p>
            <p className="muted">
              {goalReached ? 'Daily goal reached!' : `${today.remainingMl} ml to go`}
            </p>
            {today.goalIsDefault && (
              <p className="hint">Using the default goal - an admin has not set one yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Log water</h2>
        <div className="quick-add">
          {QUICK_ADD.map((amount) => (
            <button key={amount} className="btn" disabled={busy} onClick={() => addIntake(amount)}>
              + {amount} ml
            </button>
          ))}
        </div>
        <form onSubmit={addCustom} className="inline-form">
          <input
            type="number"
            min="1"
            placeholder="Custom ml"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
          <button className="btn" disabled={busy}>
            Add
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="card">
        <h2>Today's entries</h2>
        {today.entries.length === 0 ? (
          <p className="muted">No entries yet today.</p>
        ) : (
          <ul className="entry-list">
            {today.entries.map((entry) => (
              <li key={entry._id}>
                <span className="entry-amount">{entry.amountMl} ml</span>
                <span className="muted">{new Date(entry.loggedAt).toLocaleTimeString()}</span>
                <button className="btn-danger" onClick={() => removeEntry(entry._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
