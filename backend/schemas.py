from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import List

# --- Employee Schemas ---
class EmployeeBase(BaseModel):
    employee_id: str = Field(..., description="Unique Employee ID, e.g., EMP001")
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int

    class Config:
        from_attributes = True

# --- Attendance Schemas ---
class AttendanceBase(BaseModel):
    date: date
    status: str = Field(..., pattern="^(Present|Absent)$")

class AttendanceCreate(AttendanceBase):
    employee_id: int

class AttendanceResponse(AttendanceBase):
    id: int
    employee_id: int

    class Config:
        from_attributes = True
