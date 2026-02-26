from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import crud
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:5173", # Vite default
    "http://localhost:3000", # React default alternative
    "https://hrms-lite-amber-three.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to HRMS Lite API"}


# --- Employee Endpoints ---

@app.post("/api/employees", response_model=schemas.EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    # Check if employee_id already exists
    db_emp_by_id = crud.get_employee_by_emp_id(db, employee.employee_id)
    if db_emp_by_id:
        raise HTTPException(status_code=400, detail="Employee ID already registered")
    
    # Check if email already exists
    db_emp_by_email = crud.get_employee_by_email(db, employee.email)
    if db_emp_by_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    return crud.create_employee(db=db, employee=employee)


@app.get("/api/employees", response_model=List[schemas.EmployeeResponse])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = crud.get_employees(db, skip=skip, limit=limit)
    return employees


@app.delete("/api/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    success = crud.delete_employee(db, employee_id=employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    return None


# --- Attendance Endpoints ---

@app.post("/api/attendance", response_model=schemas.AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # Verify employee exists
    db_employee = crud.get_employee(db, employee_id=attendance.employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check if attendance is already marked for this date
    existing_attendance = crud.get_attendance_by_date_and_employee(
        db, employee_id=attendance.employee_id, target_date=attendance.date
    )
    if existing_attendance:
        raise HTTPException(
            status_code=400, 
            detail=f"Attendance already marked for employee on {attendance.date}"
        )

    return crud.create_attendance(db=db, attendance=attendance)


@app.get("/api/attendance/{employee_id}", response_model=List[schemas.AttendanceResponse])
def read_attendance(employee_id: int, db: Session = Depends(get_db)):
    # Verify employee exists
    db_employee = crud.get_employee(db, employee_id=employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    records = crud.get_attendance_for_employee(db, employee_id=employee_id)
    return records
