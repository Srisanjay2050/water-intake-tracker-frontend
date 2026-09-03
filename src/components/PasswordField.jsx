import { useState } from 'react';

/**
 * Password input with a show/hide toggle.
 * Props are forwarded to the underlying <input> (value, onChange, minLength...).
 */
export default function PasswordField({ label = 'Password', ...inputProps }) {
  const [show, setShow] = useState(false);

  return (
    <label>
      {label}
      <span className="password-wrap">
        <input type={show ? 'text' : 'password'} required {...inputProps} />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </span>
    </label>
  );
}
