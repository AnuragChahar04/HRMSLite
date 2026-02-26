import { NavLink, Outlet } from 'react-router-dom';
import { Users, CalendarCheck, Briefcase } from 'lucide-react';

export default function Layout() {
    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Briefcase size={24} />
                    <span>HRMS Lite</span>
                </div>
                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        end
                    >
                        <Users size={20} />
                        Employees
                    </NavLink>
                    <NavLink
                        to="/attendance"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <CalendarCheck size={20} />
                        Attendance
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
