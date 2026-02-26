# HRMS Lite

HRMS Lite is a web-based Human Resource Management System built for a single admin user. It provides essential HR operations with a simple, usable, and professional interface, allowing you to seamlessly manage employee records and track daily attendance.

## Project Overview

The application features:
- **Employee Management:** Add new employees, view a comprehensive list of all staff, and delete employee records.
- **Attendance Tracking:** Keep track of daily attendance by marking employees as Present or Absent and viewing historical attendance records.
- **Clean UI/UX:** A minimal, glassmorphic UI built from scratch using clean Vanilla CSS and modern design principles. It handles all states, including loading, empty, and errors gracefully.

## Tech Stack Used

### **Frontend**
- **React (v19) via Vite:** Fast, modern frontend framework for building the single-page application.
- **React Router (v6):** For smooth client-side navigation between the Employees and Attendance views.
- **Vanilla CSS:** Fully custom design system using CSS variables, flexbox, and semantic HTML for a highly polished look.
- **Lucide React:** Beautiful, consistent SVG icons.
- **Axios:** For executing API requests to the backend.

### **Backend**
- **FastAPI:** High-performance Python web framework for building RESTful APIs.
- **SQLAlchemy (ORM):** For handling database transactions and schemas securely.
- **Pydantic:** Robust data validation and serialization.
- **PostgreSQL:** Reliable, open-source relational database used to persist all Employee and Attendance data.

## Steps to Run the Project Locally

### Prerequisites
Make sure you have the following installed on your machine:
- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL (Running locally on port 5432)

---

### 1. Backend Setup

Open a terminal and set up the Python backend environment:

1. **Navigate to the Backend Directory:**
   ```bash
   cd backend
   ```

2. **Install Dependencies:**
   Install the required Python packages (including FastAPI, Uvicorn, SQLAlchemy, Psycopg2, etc.):
   ```bash
   pip install -r requirements.txt
   ```
   *Note: Ensure you also have `email-validator` installed, which is required by Pydantic for validating email formats.*

3. **Database Initialization:**
   Ensure PostgreSQL is running on your machine (default port `localhost:5432` with username `postgres` and password `postgres`). 
   Run the database initialization script to create the `hrms_lite` database:
   ```bash
   python create_db.py
   ```

4. **Start the FastAPI Server:**
   ```bash
   python -m uvicorn main:app --reload
   ```
   The backend API will be available at `http://127.0.0.1:8000`. You can view the automatically generated Swagger documentation at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup

Open a new terminal window to start the React frontend:

1. **Navigate to the Frontend Directory:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite Dev Server:**
   ```bash
   npm run dev
   ```
   The frontend application will be available at `http://localhost:5173`. 

---

### End-to-End Testing
Once both servers are running, navigate to `http://localhost:5173` in your browser. 
1. **Employees:** Try adding an employee (e.g., EMP001, John Doe). Observe validation preventing duplicate emails or IDs.
2. **Attendance:** Navigate to the Attendance tab in the sidebar, click on your newly created employee, and mark attendance status for the current day. 

Enjoy using HRMS Lite!
