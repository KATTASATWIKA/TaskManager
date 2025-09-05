# Task Manager (Kanban)

Full-stack Kanban-style task manager with boards, lists, tasks, subtasks, calendar view, JWT auth, and dark mode. Frontend (Vite + React) deployed on Netlify; backend (Express + MongoDB/Mongoose) on Render.

## Features

- Authentication
  - Register/Login/Logout with JWT (httpOnly cookie)
  - Persistent auth via `/api/auth/me`
- Boards
  - Create boards with title + description
  - **AI-powered board generation** using Gemini API
  - Dashboard shows boards with descriptions
  - Default lists removed; you start empty
- Lists and Tasks
  - Drag-and-drop for lists and tasks
  - Quick add task with priority, due date, labels
  - Task modal to edit title, description, due date, priority, labels
  - Subtasks with checkboxes and progress; directly toggle from task cards
- **AI Board Generation**
  - Generate complete board structures from natural language prompts
  - AI creates lists, tasks, subtasks, priorities, and due dates
  - Powered by Google Gemini API
- Calendar View
  - Month/Week views aggregating due-dated tasks across all boards
  - Drag task to a day to reschedule (updates dueDate)
- Theming
  - Light mode by default
  - Smooth transitions and full-viewport dark mode coverage
- Deployment-ready
  - Netlify (client) + Render (server)
  - CORS and cookies configured for cross-site auth

## Tech Stack

- Frontend: React (Vite), Zustand, React Router, Axios
- Backend: Node.js, Express, Mongoose (MongoDB)
- Auth: JWT (cookies), bcrypt
- AI: Google Gemini API for board generation
- UI: Lucide icons, custom CSS

## Monorepo Structure

```
kanban-task-manager/
  client/                 # Vite React frontend
  server/                 # Express + Mongoose backend
```

## Environment Variables

Backend (`server/.env`):
- MONGODB_URI=your_mongodb_atlas_uri
- JWT_SECRET=your_jwt_secret
- CLIENT_URL=https://your-netlify-site (no trailing slash)
- PORT=5000 (or Render default)
- GOOGLE_API_KEY=your_google_api_key (for AI board generation)

Frontend (`client/.env`):
- VITE_API_URL=https://your-render-backend.onrender.com/api

Note:
- Do not include trailing slashes in `CLIENT_URL`.
- `VITE_API_URL` must point to `/api`.

## Local Development

1) Backend
- Create `server/.env` (see above)
- Install and run:
```
cd server
npm install
npm start
```

2) Frontend
- Create `client/.env` with:
```
VITE_API_URL=http://localhost:5000/api
```
- Install and run:
```
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Production Deployment

Frontend (Netlify):
- Base directory: `TaskManager-main/kanban-task-manager/client`
- Build command: `npm run build`
- Publish: `dist`
- Env: `VITE_API_URL=https://your-render-backend.onrender.com/api`
- Redirects (netlify.toml):
```
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Backend (Render):
- Root directory: `TaskManager-main/kanban-task-manager/server`
- Build command: `npm install`
- Start command: `node server.js` (or `npm start` if defined)
- Env:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `CLIENT_URL=https://your-netlify-site` (no trailing slash)
  - `GOOGLE_API_KEY` (for AI board generation)
  - `NODE_ENV=production`

CORS/Cookies:
- Server trusts proxy and sets cookies with `SameSite=None; Secure` in production.
- Client Axios is configured with `withCredentials: true`.

## Key Routes

Frontend (React Router):
- `/` Landing (unauthenticated)
- `/login`, `/register`
- `/dashboard` (boards overview)
- `/dashboard/board/:id` (board view with lists + tasks)
- `/dashboard/calendar` (calendar with due-dated tasks)

Backend (Express, prefixed with `/api`):
- Auth: `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`
- Boards: `/boards` (GET, POST), `/boards/:id` (GET, PATCH, DELETE), `/boards/:id/lists` (POST)
- AI: `/boards/ai-generate` (POST), `/boards/:id/ai-suggest-tasks` (POST)
- Lists: `/lists/:id` (PATCH, DELETE)
- Tasks: `/tasks/lists/:listId/tasks` (POST), `/tasks/:taskId` (PATCH, DELETE)

## Notable Implementation Details

- Removed default list creation on new boards; backend returns empty board + empty lists.
- Enhanced `ThemeContext` to default to light; dark mode applies to full viewport and scrollbars.
- `VITE_API_URL` used in Axios base URL for robust prod/dev switching.
- React Router routes use `/dashboard/board/:id` (avoid path conflicts).
- Fixes for redirect loops by ensuring `/api/auth/me` returns 401 for missing/invalid tokens.
- Cross-site cookies for Netlify → Render using `SameSite=None; Secure`; `trust proxy` enabled.

## Common Troubleshooting

- 401 Unauthorized on API
  - Ensure `CLIENT_URL` on backend exactly matches Netlify domain (no trailing slash)
  - Ensure `VITE_API_URL` points to `https://<render-app>.onrender.com/api`
  - Cookies must be sent: Axios uses `withCredentials: true`
- CORS preflight fails
  - Origin mismatch (check trailing slash, correct Netlify domain)
- “Cannot GET /api/…” in browser
  - `/api` is a prefix; open actual endpoints like `/api/auth/me`
- Vercel/Netlify build issues
  - `vite` and plugin are dependencies so builds run in prod
- Local PowerShell `&&` errors
  - Use separate lines instead of `&&` in PowerShell

## Scripts

Client:
- `npm run dev` - dev server
- `npm run build` - prod build
- `npm run preview` - preview build

Server:
- `npm start` - start backend

## UI Walkthrough

- Dashboard
  - “New Board” opens modal with Title + Description
  - Cards show title + description + created/updated dates
- Board
  - Title and description in header
  - Add Quick/Default lists
  - Drag lists/tasks
  - Quick add tasks with priority/due date/labels
  - Subtasks toggle directly from task card; edit all fields in modal
- Calendar
  - Month/Week switcher
  - Drag tasks between days to update dueDate

## Security Notes

- JWT in httpOnly cookie to prevent XSS access
- `SameSite=None; Secure` with `trust proxy` for cross-site usage over HTTPS
- Password hashing with bcrypt

## License

MIT
