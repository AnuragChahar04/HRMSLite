import { useState, useEffect } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';
import { Plus, Trash2, X, AlertCircle } from 'lucide-react';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: 'Engineering'
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const data = await getEmployees();
            setEmployees(data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to load employees.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            await createEmployee(formData);
            setIsModalOpen(false);
            setFormData({
                employee_id: '',
                full_name: '',
                email: '',
                department: 'Engineering'
            });
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add employee');
        }
    };

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        try {
            await deleteEmployee(id);
            fetchEmployees();
        } catch (err) {
            setError('Failed to delete employee.');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Employees</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Add Employee
                </button>
            </div>

            {error && !isModalOpen && (
                <div className="alert alert-danger">
                    <AlertCircle size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="loader-container">Loading employees...</div>
            ) : employees.length === 0 ? (
                <div className="card empty-state">
                    <UsersIcon />
                    <h3>No employees found</h3>
                    <p>Add a new employee to get started.</p>
                </div>
            ) : (
                <div className="card table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Emp ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td>{emp.employee_id}</td>
                                    <td><strong>{emp.full_name}</strong></td>
                                    <td>{emp.email}</td>
                                    <td>
                                        <span className="badge badge-secondary">{emp.department}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteEmployee(emp.id)}
                                            title="Delete Employee"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Employee Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">Add New Employee</h2>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {error && isModalOpen && (
                                <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
                                    {error}
                                </div>
                            )}
                            <form id="add-employee-form" onSubmit={handleAddEmployee}>
                                <div className="form-group">
                                    <label className="form-label">Employee ID</label>
                                    <input
                                        type="text"
                                        name="employee_id"
                                        required
                                        className="form-control"
                                        placeholder="e.g. EMP001"
                                        value={formData.employee_id}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        required
                                        className="form-control"
                                        placeholder="John Doe"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="form-control"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Department</label>
                                    <select
                                        name="department"
                                        className="form-control"
                                        value={formData.department}
                                        onChange={handleChange}
                                    >
                                        <option value="Engineering">Engineering</option>
                                        <option value="HR">HR</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Finance">Finance</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-outline"
                                onClick={() => { setIsModalOpen(false); setError(''); }}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button className="btn btn-primary" type="submit" form="add-employee-form">
                                Save Employee
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function UsersIcon() {
    return (
        <svg className="empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
