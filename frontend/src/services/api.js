import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const getEmployees = async () => {
    const response = await api.get('/employees');
    return response.data;
};

export const createEmployee = async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
};

export const deleteEmployee = async (employeeId) => {
    await api.delete(`/employees/${employeeId}`);
};

export const getAttendance = async (employeeId) => {
    const response = await api.get(`/attendance/${employeeId}`);
    return response.data;
};

export const markAttendance = async (attendanceData) => {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
};

export default api;
