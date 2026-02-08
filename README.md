# Todo App - Hackathon II

A full-stack todo web application built with Next.js 14 (frontend) and FastAPI (backend) using PostgreSQL database.

## Project Overview

This is a monorepo project using GitHub Spec-Kit for spec-driven development.

### Technologies Used

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form with Zod validation
- Lucide React Icons
- Radix UI Components

**Backend:**
- FastAPI
- SQLModel (ORM)
- PostgreSQL
- Authentication with JWT
- Pydantic for data validation

### Project Structure

```
├── frontend/          # Next.js 14 frontend
│   ├── app/          # App Router pages
│   ├── components/   # Reusable components
│   └── lib/          # Utilities and API client
├── backend/          # FastAPI backend
│   ├── models.py     # SQLModel database models
│   ├── routes/       # API route handlers
│   │   ├── auth.py   # Authentication endpoints
│   │   └── tasks.py  # Task CRUD endpoints
│   ├── db.py         # Database connection
│   └── middleware/   # Custom middleware
└── specs/            # Specifications
    ├── features/     # Feature specs
    ├── api/          # API specs
    ├── database/    # Database specs
    └── ui/           # UI specs
```

## Features

- User authentication (login/register)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Filter tasks by status
- Responsive design with Tailwind CSS
- Real-time validation

## Getting Started

### Prerequisites

- Node.js 18+ for frontend
- Python 3.10+ for backend
- PostgreSQL database (Neon recommended)
- npm or yarn for package management

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://username:password@localhost/todo_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Installation

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

### Option 1: Run Both Services Separately

**Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will be available at: http://localhost:3000

**Start Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```
Backend API will be available at: http://localhost:8000
API documentation at: http://localhost:8000/docs

### Option 2: Use Docker Compose

```bash
docker-compose up
```

This will start both services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks for current user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{task_id}` - Update task
- `DELETE /api/tasks/{task_id}` - Delete task
- `PUT /api/tasks/{task_id}/complete` - Mark task as complete

## Development Workflow

1. Read relevant specs: `specs/features/[feature].md`
2. Implement backend changes
3. Implement frontend changes
4. Test and iterate

## Scripts

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run test     # Run tests
```

### Backend Scripts
```bash
uvicorn main:app --reload  # Start development server
pytest                      # Run tests
```

## Contributing

1. Follow the spec-driven development workflow
2. Update specs when requirements change
3. Run tests before committing
4. Follow the project structure guidelines

## License

MIT License