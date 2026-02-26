import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EmployeesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
