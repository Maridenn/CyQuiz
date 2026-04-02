# ⚡ CyQuiz

A full-stack quiz platform built with **React**, **Express**, and **PostgreSQL**.

---

## Features

- 🔐 JWT auth (register / login)
- 🎯 Take timed quizzes with live countdown
- 📊 Per-question result review after each attempt
- 🏆 Global leaderboard
- 🛠 Admin panel: create quizzes, manage questions, view all scores
- 🎨 Dark UI with responsive design

---

## Project Structure

```
demo/
├── backend/      Express API + EJS views
└── frontend/     React + Vite SPA
```

---

## Quick Start

### 1. Database

```sql
-- Create the database
CREATE DATABASE quizapp;

-- Run the schema (connects and runs all migrations + seed)
psql -U postgres -d quizapp -f backend/schema.sql
```

### 2. Backend

```bash
cd backend
npm install

# Copy and fill in your env vars
cp .env_sample .env

npm run dev   # starts on http://localhost:5000
```

**.env values to set:**
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quizapp
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=change_this_to_something_random
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev   # starts on http://localhost:5173
```

---

## Default Admin Account

| Field    | Value           |
|----------|-----------------|
| Email    | admin@quiz.com  |
| Password | admin123        |

> ⚠️ Change the password after first login in production!

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✓ | Current user |
| GET | /api/quizzes | ✓ | List quizzes |
| POST | /api/quizzes | Admin | Create quiz |
| PUT | /api/quizzes/:id | Admin | Update quiz |
| DELETE | /api/quizzes/:id | Admin | Delete quiz |
| GET | /api/questions/quiz/:id | ✓ | Get questions |
| POST | /api/questions | Admin | Add question |
| PUT | /api/questions/:id | Admin | Update question |
| DELETE | /api/questions/:id | Admin | Delete question |
| POST | /api/attempts/submit | ✓ | Submit quiz |
| GET | /api/attempts/my | ✓ | My attempts |
| GET | /api/attempts/all | Admin | All attempts |
| GET | /api/leaderboard | ✓ | Global leaderboard |
| GET | /api/leaderboard/quiz/:id | ✓ | Per-quiz leaderboard |

---

## Tech Stack

- **Frontend**: React 18, React Router v6, Axios, Vite
- **Backend**: Express 4, JWT, bcrypt, EJS
- **Database**: PostgreSQL + pg driver
