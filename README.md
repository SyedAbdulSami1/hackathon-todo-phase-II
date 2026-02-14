# Full-Stack Todo Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A modern, full-stack Todo application built with Next.js for the frontend and FastAPI for the backend. It features user authentication, task management, and a clean, responsive UI.

## Features

- **User Authentication:** Secure user registration and login with JWT-based authentication.
- **Task Management:** Create, read, update, and delete tasks.
- **Task Filtering:** Filter tasks by status (All, Pending, Completed).
- **Responsive UI:** A clean and modern user interface that works on all screen sizes.
- **Containerized:** Easily run the entire application with Docker Compose.

## Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/)
- [Python](https://www.python.org/)
- [SQLModel](https://sqlmodel.tiangolo.com/)
- [PostgreSQL](https://www.postgresql.org/) (with [Neon](https://neon.tech/))

**Tooling:**
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Python](https://www.python.org/) (v3.8 or later)
- [Docker](https://www.docker.com/get-started) (for Docker setup)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPOSITORY_URL_HERE]
    cd hackathon-todo-phase-II # Or your repository name
    ```
    (Remember to replace `[YOUR_REPOSITORY_URL_HERE]` with your actual repository URL if you fork this project.)

2.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory by copying the `.env.template` file.
    ```bash
    cp backend/.env.template backend/.env
    ```
    Update the `DATABASE_URL` in `backend/.env` with your Neon DB connection string.

### Running the Application

There are two ways to run the application:

<details>
<summary><b>🚀 Using Docker (Recommended for Development)</b></summary>

This setup is optimized for local development with hot-reloading. It is not intended for production deployments.

1.  **Build and run the application:**
    ```bash
    docker-compose up --build
    ```

2.  **Access the application:**
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Backend: [http://localhost:8000](http://localhost:8000)

</details>

<details>
<summary><b>💻 Running Locally</b></summary>

**Backend:**

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run database migrations:**
    ```bash
    python migrate_db.py
    ```

5.  **Start the server:**
    ```bash
    uvicorn main:app --reload
    ```

**Frontend:**

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

</details>

## Project Structure

```
.
├── backend/         # FastAPI backend
│   ├── Dockerfile
│   ├── main.py
│   ├── models.py
│   ├── db.py
│   └── ...
└── frontend/        # Next.js frontend
    ├── Dockerfile
    ├── app/
    ├── components/
    ├── lib/
    └── ...
├── docker-compose.yml
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
