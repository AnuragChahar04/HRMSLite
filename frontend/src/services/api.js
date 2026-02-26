import axios from 'axios';

const api = axios.create({
    baseURL: 'https://hrmslite-4tra.onrender.com',
});

export const getEmployees = async () => {
    const response = await api.get('/api/employees');
    return response.data;
};

export const createEmployee = async (employeeData) => {
    const response = await api.post('/api/employees', employeeData);
    return response.data;
};

export const deleteEmployee = async (employeeId) => {
    await api.delete(`/api/employees/${employeeId}`);
};

export const getAttendance = async (employeeId) => {
    const response = await api.get(`/api/attendance/${employeeId}`);
    return response.data;
};

export const markAttendance = async (attendanceData) => {
    const response = await api.post('/api/attendance', attendanceData);
    return response.data;
};

export default api;
