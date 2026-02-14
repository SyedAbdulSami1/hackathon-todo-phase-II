
# Todo App

This is a full-stack Todo application with a Next.js frontend and a FastAPI backend.

## Project Structure

```
├── backend/         # FastAPI backend
│   ├── main.py
│   ├── models.py
│   ├── db.py
│   ├── requirements.txt
│   └── routers/
│       ├── auth.py
│       └── tasks.py
└── frontend/        # Next.js frontend
    ├── app/
    ├── components/
    ├── lib/
    └── package.json
```

## Running with Docker Compose

This is the recommended way to run the application.

1.  **Set up the environment variables:**
    Create a `.env` file in the `backend` directory and add the following, replacing the placeholder with your Neon DB connection string:
    ```
    DATABASE_URL="postgresql://neondb_owner:your_password@ep-misty-brook-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"
    ```

2.  **Run the application:**
    ```bash
    docker-compose up --build
    ```

    The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

## Running the Application Locally

### Prerequisites

- Node.js (v18 or later)
- Python (v3.8 or later)
- pip
- virtualenv (recommended)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install the required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up the environment variables:**
    Create a `.env` file in the `backend` directory and add the following, replacing the placeholder with your Neon DB connection string:
    ```
    DATABASE_URL="postgresql://neondb_owner:your_password@ep-misty-brook-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"
    ```

5.  **Run the database migrations:**
    ```bash
    python migrate_db.py
    ```

6.  **Start the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install the required dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:3000`.

### Accessing the Application

Open your web browser and navigate to `http://localhost:3000`. You should see the login and registration page. You can create a new account or log in with an existing one.
