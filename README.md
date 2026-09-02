# Water Intake Tracker — Frontend

React single-page app for logging daily water intake and tracking it against a
recommended daily goal. Includes an admin dashboard for managing users and
setting the goal.

Built with **React + Vite + React Router**, talking to the
[backend API](../backend) over REST with a JWT access token.

---

## Features

### User
- Register / log in
- Log water intake — quick-add buttons (250 / 500 / 750 ml) or a custom amount
- "Today" view: running total vs daily goal, progress bar, remaining amount
- History view: past days with daily totals, expandable to individual entries
- Delete a logged entry (from Today or History)

### Admin
- Log in and land on the admin dashboard
- View all registered users with an intake summary
- Drill into any user's full intake history
- Set / update the recommended daily goal
- Delete a user account (own account is disabled)

---

## Tech stack

| Concern         | Choice                |
| --------------- | -------------------- |
| Build tool      | Vite 5               |
| UI              | React 18             |
| Routing         | React Router 6       |
| HTTP            | Axios                |
| Auth state      | React Context + `localStorage` |
| Styling         | Plain CSS (`src/styles.css`) |

---

## Getting started

### 1. Prerequisites

- Node.js 18+
- The backend API running (see [`../backend/README.md`](../backend/README.md))

### 2. Install

```bash
cd frontend
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

| Variable             | Required | Description                                          |
| -------------------- | :------: | -------------------------------------------------- |
| `VITE_API_BASE_URL`  |  **yes** | Base URL of the backend API, no trailing slash. Default: `http://localhost:5000/api` |

The base URL is read in [`src/config.js`](src/config.js); no other file hardcodes
the API location.

### 4. Run

```bash
npm run dev       # http://localhost:5173
```

### 5. Build for production

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

---

## Logging in

- **User:** register a new account from the Register page.
- **Admin:** use the credentials seeded by the backend
  (`npm run seed:admin` — defaults `admin@example.com` / `Admin@12345`, override
  via the backend `.env`). Admins are routed to `/admin/users` on login.

---

## How it works

- On login/register the JWT access token is stored in `localStorage` and attached
  as `Authorization: Bearer <token>` by an Axios request interceptor
  ([`src/api/client.js`](src/api/client.js)).
- `AuthContext` verifies the stored token on first load via `GET /auth/me` and
  exposes `user`, `login`, `register`, `logout`.
- `ProtectedRoute` redirects unauthenticated users to `/login`; with `adminOnly`
  it also keeps non-admins out of `/admin/*`. The backend independently enforces
  the same rules (a `user` hitting an admin route gets `403`).
- API errors are normalised to readable messages by an Axios response
  interceptor and shown inline on each page.

---

## Project structure

```
frontend/
├── .env.example
├── index.html
├── vite.config.js
└── src/
    ├── main.jsx                 # entry: Router + AuthProvider
    ├── App.jsx                  # route table
    ├── config.js                # reads VITE_API_BASE_URL
    ├── api/client.js            # axios instance + interceptors
    ├── context/AuthContext.jsx  # auth state / actions
    ├── components/
    │   ├── Navbar.jsx
    │   └── ProtectedRoute.jsx   # auth + admin route guard
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx        # user: log + today vs goal
    │   ├── History.jsx          # user: past days + entries
    │   ├── AdminUsers.jsx       # admin: user list + delete
    │   ├── AdminUserDetail.jsx  # admin: one user's history
    │   └── AdminSettings.jsx    # admin: daily goal
    └── styles.css
```

---

## Scripts

| Command           | Description                        |
| ---------------- | -------------------------------- |
| `npm run dev`     | Start the Vite dev server         |
| `npm run build`   | Production build to `dist/`        |
| `npm run preview` | Preview the production build       |
