from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models
import schemas
from datetime import date
from typing import List, Optional

# --- Employee CRUD ---
def get_employee(db: Session, employee_id: int) -> Optional[models.Employee]:
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def get_employee_by_emp_id(db: Session, emp_id_str: str) -> Optional[models.Employee]:
    return db.query(models.Employee).filter(models.Employee.employee_id == emp_id_str).first()

def get_employee_by_email(db: Session, email: str) -> Optional[models.Employee]:
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100) -> List[models.Employee]:
    return db.query(models.Employee).offset(skip).limit(limit).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate) -> models.Employee:
    db_employee = models.Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int) -> bool:
    db_employee = get_employee(db, employee_id)
    if db_employee:
        db.delete(db_employee)
        db.commit()
        return True
    return False

# --- Attendance CRUD ---
def get_attendance_for_employee(db: Session, employee_id: int) -> List[models.Attendance]:
    return db.query(models.Attendance).filter(models.Attendance.employee_id == employee_id).order_by(models.Attendance.date.desc()).all()

def get_attendance_by_date_and_employee(db: Session, employee_id: int, target_date: date) -> Optional[models.Attendance]:
    return db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id,
        models.Attendance.date == target_date
    ).first()

def create_attendance(db: Session, attendance: schemas.AttendanceCreate) -> models.Attendance:
    db_attendance = models.Attendance(**attendance.model_dump())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance
