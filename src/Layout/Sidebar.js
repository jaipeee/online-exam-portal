import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();

  // Show sidebar only for student routes
  const isStudentRoute = location.pathname.startsWith("/student");

  if (!isStudentRoute) return null; // Hide for non-student routes (admin, etc.)

  return (
    <div className="sidebar">
      <h2>Student Panel</h2>
      <nav>
        <NavLink to="/student/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
        <NavLink to="/student/exam" className={({ isActive }) => isActive ? "active" : ""}>Exams</NavLink>
        <NavLink to="/student/result" className={({ isActive }) => isActive ? "active" : ""}>Results</NavLink>
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Logout</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;