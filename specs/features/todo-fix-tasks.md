# Todo App Fix - Phase II Status

## Completed Tasks (Done Today)
- [x] **CORS Configuration**: Updated `main.py` to be more permissive.
- [x] **Bcrypt Fix**: Downgraded `bcrypt` to `3.2.0` to fix compatibility with `passlib` on Windows.
- [x] **SQLModel Queries**: Fixed `session.exec()` syntax in `dependencies/auth.py`.
- [x] **Auth Logic**: Updated backend to allow login with both **Username** and **Email**.
- [x] **Frontend Mapping**: Updated login form to send `x-www-form-urlencoded` data as required by FastAPI.
- [x] **Registration Flow**: Updated backend to return a Token immediately after registration.

## Remaining Tasks (For Tomorrow)
- [ ] **Debug 500 Internal Server Error**: 
    - Need to check the exact Traceback in the backend terminal.
    - Common causes: missing `select` import or database schema mismatch.
- [ ] **Finalize Login Flow**: Ensure the frontend correctly stores the token and redirects to the dashboard.
- [ ] **Vercel Deployment**: 
    - Prepare `vercel.json`.
    - Set up production `DATABASE_URL` and `SECRET_KEY`.

## Current Error State
Browser shows `CORS Error` on `/api/auth/login`, but the real cause is a `500 Internal Server Error` on the backend. Fix the 500 error, and CORS will automatically go away.
