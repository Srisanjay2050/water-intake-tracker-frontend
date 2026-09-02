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

  return (
    <div className="stack">
      <div className="card">
        <h1>Today - {today.day}</h1>
        <div className="progress-wrap" role="progressbar" aria-valuenow={pct}>
          <div className={`progress-bar ${goalReached ? 'is-full' : ''}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="big">
          {today.totalMl} ml <span className="muted">/ {today.goalMl} ml</span>
        </p>
        <p className="muted">
          {goalReached ? 'Daily goal reached!' : `${today.remainingMl} ml to go`}
          {today.goalIsDefault && ' - using default goal (admin has not set one yet)'}
        </p>
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
