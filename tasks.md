# Tasks

## User Stories

### Create Task

- [X] [T1] [P1] [ST1] Implement task creation API endpoint in FastAPI. (@backend/CLAUDE.md, @specs/features/task-crud.md)
- [X] [T2] [P1] [ST1] Implement task creation form in Next.js. (@frontend/CLAUDE.md, @specs/features/task-crud.md)

### View Tasks

- [X] [T3] [P1] [ST2] Implement API endpoint to fetch tasks for the current user. (@backend/CLAUDE.md, @specs/features/task-crud.md)
- [X] [T4] [P1] [ST2] Implement task list display with filtering in Next.js. (@frontend/CLAUDE.md, @specs/features/task-crud.md)

### Update Task

- [X] [T5] [P1] [ST3] Implement API endpoint to update a task. (@backend/CLAUDE.md, @specs/features/task-crud.md)
- [X] [T6] [P1] [ST3] Implement task editing functionality in Next.js. (@frontend/CLAUDE.md, @specs/features/task-crud.md)

### Delete Task

- [X] [T7] [P1] [ST4] Implement API endpoint to delete a task. (@backend/CLAUDE.md, @specs/features/task-crud.md)
- [X] [T8] [P1] [ST4] Implement task deletion functionality in Next.js. (@frontend/CLAUDE.md, @specs/features/task-crud.md)

### Mark Task Complete

- [X] [T9] [P1] [ST5] Implement API endpoint to mark a task as complete. (@backend/CLAUDE.md, @specs/features/task-crud.md)
- [X] [T10] [P1] [ST5] Implement task completion toggle in Next.js. (@frontend/CLAUDE.md, @specs/features/task-crud.md)

## Foundational Tasks

- [X] [TF1] [P0] Setup database models for tasks using SQLModel. (@backend/models.py, @specs/database/schema.md)
- [X] [TF2] [P0] Configure database connection in FastAPI. (@backend/db.py, @backend/CLAUDE.md)
- [X] [TF3] [P0] Implement API client for frontend in Next.js. (@frontend/lib/api.ts, @frontend/CLAUDE.md)

## Polish Phase

- [X] [TP1] [P2] Add input validation for task creation and updates. (@backend/CLAUDE.md, @frontend/CLAUDE.md, @specs/features/task-crud.md)
- [X] [TP2] [P2] Implement error handling and display for API calls. (@backend/CLAUDE.md, @frontend/CLAUDE.md)
- [X] [TP3] [P2] Refine UI/UX for task management. (@frontend/CLAUDE.md, @specs/ui/components.md)
- [X] [TP4] [P2] Write unit tests for backend API endpoints. (@backend/tests/, @backend/CLAUDE.md)
- [X] [TP5] [P2] Write integration tests for frontend components. (@frontend/tests/, @frontend/CLAUDE.md)
- [X] [TP6] [P2] Fix type mismatches between backend and frontend status fields. (@frontend/types/, @frontend/components/)
- [X] [TP7] [P2] Add In-Progress filter option to frontend. (@frontend/components/task-list.tsx)
- [X] [TP8] [P2] Configure environment variables for both frontend and backend. (@frontend/.env.local, @backend/.env)
