import { useCallback, useEffect, useState } from 'react';
import client from '../api/client';

export default function AdminSettings() {
  const [goal, setGoal] = useState('');
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const { data } = await client.get('/settings/goal');
      setCurrent(data);
      setGoal(String(data.dailyGoalMl));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const value = Number(goal);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Goal must be a number greater than 0.');
      return;
    }
    setBusy(true);
    try {
      const { data } = await client.put('/settings/goal', { dailyGoalMl: value });
      setCurrent(data);
      setMessage('Daily goal updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card auth-card">
      <h1>Recommended daily goal</h1>
      {current && (
        <p className="muted">
          Current: <strong>{current.dailyGoalMl} ml</strong>
          {current.isDefault && ' (default — not yet set by an admin)'}
        </p>
      )}
      <form onSubmit={save}>
        <label>
          Daily goal (ml)
          <input
            type="number"
            min="1"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </label>
        <p className="hint">Tip: 8 glasses ≈ 2000 ml.</p>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <button className="btn" disabled={busy}>
          {busy ? 'Saving…' : 'Save goal'}
        </button>
      </form>
    </div>
  );
}
