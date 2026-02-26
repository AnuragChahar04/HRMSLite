import { useState, useEffect } from 'react';
import { getEmployees, getAttendance, markAttendance } from '../services/api';
import { Check, X, AlertCircle } from 'lucide-react';

export default function AttendancePage() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const [isLoadingEmp, setIsLoadingEmp] = useState(true);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [error, setError] = useState('');

    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setIsLoadingEmp(true);
            const data = await getEmployees();
            setEmployees(data);
            if (data.length > 0) {
                handleSelectEmployee(data[0]);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load employees.');
        } finally {
            setIsLoadingEmp(false);
        }
    };

    const handleSelectEmployee = async (employee) => {
        setSelectedEmployee(employee);
        setError('');

        try {
            setIsLoadingRecords(true);
            const data = await getAttendance(employee.id);
            setAttendanceRecords(data);
        } catch (err) {
            setError('Failed to load attendance records.');
        } finally {
            setIsLoadingRecords(false);
        }
    };

    const handleMarkAttendance = async (status) => {
        if (!selectedEmployee) return;
        setError('');

        try {
            await markAttendance({
                employee_id: selectedEmployee.id,
                date: attendanceDate,
                status: status
            });
            // Refresh records
            handleSelectEmployee(selectedEmployee);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to mark attendance');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Attendance</h1>
            </div>

            {error && (
                <div className="alert alert-danger">
                    <AlertCircle size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                    {error}
                </div>
            )}

            {isLoadingEmp ? (
                <div className="loader-container">Loading employees...</div>
            ) : employees.length === 0 ? (
                <div className="card empty-state">
                    <h3>No employees available</h3>
                    <p>Please add employees first before marking attendance.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

                    {/* Sidebar list of employees */}
                    <div className="card" style={{ width: '300px', flexShrink: 0 }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Select Employee</h3>
                        </div>
                        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            {employees.map(emp => (
                                <div
                                    key={emp.id}
                                    onClick={() => handleSelectEmployee(emp)}
                                    style={{
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        borderLeft: selectedEmployee?.id === emp.id ? '3px solid var(--primary)' : '3px solid transparent',
                                        backgroundColor: selectedEmployee?.id === emp.id ? '#F3F4F6' : 'transparent',
                                        borderBottom: '1px solid var(--border)'
                                    }}
                                >
                                    <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{emp.full_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.employee_id} • {emp.department}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attendance Details View */}
                    {selectedEmployee && (
                        <div style={{ flex: 1 }}>
                            <div className="card" style={{ marginBottom: '2rem' }}>
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                                    <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{selectedEmployee.full_name}</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {selectedEmployee.employee_id} • {selectedEmployee.department}
                                    </p>
                                </div>

                                <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                                    <div className="form-group" style={{ marginBottom: 0, width: '200px' }}>
                                        <label className="form-label">Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={attendanceDate}
                                            onChange={(e) => setAttendanceDate(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]} // Can't mark future attendance
                                        />
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        style={{ backgroundColor: 'var(--success)' }}
                                        onClick={() => handleMarkAttendance('Present')}
                                    >
                                        <Check size={18} /> Mark Present
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleMarkAttendance('Absent')}
                                    >
                                        <X size={18} /> Mark Absent
                                    </button>
                                </div>
                            </div>

                            {/* Attendance History Table */}
                            <div className="card">
                                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Attendance History</h3>
                                </div>

                                {isLoadingRecords ? (
                                    <div className="loader-container" style={{ padding: '2rem' }}>Loading records...</div>
                                ) : attendanceRecords.length === 0 ? (
                                    <div className="empty-state" style={{ padding: '2rem' }}>
                                        <p>No attendance records found for this employee.</p>
                                    </div>
                                ) : (
                                    <div className="table-container">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceRecords.map(record => (
                                                    <tr key={record.id}>
                                                        <td>{new Date(record.date).toLocaleDateString()}</td>
                                                        <td>
                                                            <span className={`badge ${record.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                                                                {record.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
