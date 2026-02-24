# StudyBuddy 🧠📚  
A modern **course + notes** management app with **AI-powered note summarization** to help students study smarter.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [High-Level Flow](#high-level-flow)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Database](#database)
- [API Endpoints](#api-endpoints)
- [Postman Collection](#postman-collection)
- [Setup & Run Locally](#setup--run-locally)
  - [Backend](#backend-1)
  - [Frontend](#frontend-1)
- [Environment Variables](#environment-variables)
- [Notes / Known Limitations](#notes--known-limitations)
- [Future Improvements](#future-improvements)

---

## Project Overview
**StudyBuddy** is a full-stack web application that helps users:
- Create and manage **courses**
- Write and organize **markdown notes** under each course
- Generate concise **AI summaries** for revision using an LLM API  
- Preview markdown content and read summaries in a clean UI

This project is designed as an MVP with an emphasis on:
- Simple and usable UX
- Clean REST API design (nested resources)
- Persistent storage with SQLite
- Real AI integration for note summarization

---

## Key Features
- **Authentication (MVP)**
  - Signup + Login (simple, header-based user scoping for MVP)
- **Courses**
  - Create / list / view / update / delete courses
- **Notes**
  - Notes are **nested under courses**
  - Create / list / view / update / delete notes
  - Markdown editor with **Write** and **Preview** tabs
- **AI Summarization**
  - “✨ still need to implement got some error
- **Improved UI**
  - Better readability, consistent styling, improved modal/background, responsive layout

---

## Tech Stack
### Frontend
- **React + Vite**
- **React Router**
- **Axios** for API calls
- **react-markdown** + **remark-gfm** for markdown rendering
- Custom CSS with shared variables for consistent UI

### Backend
- **Node.js + Express**
- **better-sqlite3** for SQLite database access
- **dotenv** for configuration

### Database
- **SQLite** (local DB file)

### AI
- **Groq API** (OpenAI-compatible chat completions)

---

## Architecture

### High-Level Flow
1. User logs in / signs up (frontend stores user in `localStorage`)
2. Frontend makes API calls to backend (`/api/...`)
3. Backend reads user scope from header `x-user-id`
4. Backend stores/retrieves data in SQLite
5. When user clicks **Summarize**, backend calls Groq LLM and:
   - Generates summary
   - Saves it to `notes.summary`
   - Returns summary to frontend

### Frontend
- [frontend/src/api.js](cci:7://file:///c:/Users/vivek/Desktop/studyBuddy/frontend/src/api.js:0:0-0:0)
  - Axios client with base URL:
    - `VITE_API_BASE_URL` OR defaults to `http://localhost:5000/api`
  - Automatically attaches `x-user-id` from `localStorage`
- Pages:
  - **Dashboard**: list + create courses
  - **CourseDetail**: list notes under a course
  - **NoteEditor**: edit note + markdown preview + summarize button

### Backend
- [backend/server.js](cci:7://file:///c:/Users/vivek/Desktop/studyBuddy/backend/server.js:0:0-0:0) exposes REST API under `/api`
- Middleware:
  - `express.json()` for JSON body parsing
  - `cors()` for cross-origin frontend calls
- Auth model (MVP):
  - User is identified using `x-user-id` header
  - Data is filtered by `user_id` on relevant resources

### Database
- [backend/studybuddy.db](cci:7://file:///c:/Users/vivek/Desktop/studyBuddy/backend/studybuddy.db:0:0-0:0) (SQLite)
- Core entities:
  - `users`
  - `courses` (belongs to `users`)
  - `notes` (belongs to `courses`, contains `summary` field)

### AI Summarization
- Endpoint:
  - `POST /api/courses/:courseId/notes/:noteId/summarize`
- Behavior:
  - Validates course ownership (`user_id`)
  - Loads note content
  - Calls Groq chat completion model (e.g. `llama3-8b-8192`)
  - Saves AI-generated markdown summary into SQLite

---

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Courses
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id`

### Notes (Nested under courses)
- `GET /api/courses/:courseId/notes`
- `GET /api/courses/:courseId/notes/:noteId`
- `POST /api/courses/:courseId/notes`
- `PUT /api/courses/:courseId/notes/:noteId`
- `DELETE /api/courses/:courseId/notes/:noteId`

### AI
- `POST /api/courses/:courseId/notes/:noteId/summarize`

> Protected routes require header:  
> `x-user-id: <userId>`

---

## Postman Collection
A Postman collection is included to test all endpoints:

- [StudyBuddy.postman_collection.json](cci:7://file:///c:/Users/vivek/Desktop/studyBuddy/StudyBuddy.postman_collection.json:0:0-0:0)

Import it into Postman:
- Postman → **Import** → Select the JSON file

It includes variables:
- `baseUrl` (default `http://localhost:5000/api`)
- `userId`, `courseId`, `noteId`

---

## Setup & Run Locally

### Backend
```bash
cd backend
npm install
npm run dev

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create environment variables file `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Notes / Known Limitations

- Authentication is intentionally simple for MVP (no JWT/session tokens)
- `x-user-id` header is used for scoping and should be upgraded for production
- AI summarization depends on Groq API availability and rate limits
- Node 18+ recommended (uses built-in fetch)

## Future Improvements

- [ ] Proper authentication (JWT + hashed passwords)
- [ ] Rich text editor (or MD editor with toolbar)
- [ ] Search and tags for notes
- [ ] Sharing courses/notes
- [ ] Background summarization jobs + caching
- [ ] Improved error UI + toast notifications
- [ ] Deployment (Docker + cloud hosting)
