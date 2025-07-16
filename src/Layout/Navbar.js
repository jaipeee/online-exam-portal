import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebaseConfig";
import "../styles/Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();

  function logout() {
    auth.signOut().then(() => navigate("/"));
  }

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/subjects">Manage Subjects</Link>
          <Link to="/admin/exam">Manage Exams</Link>
          <Link to="/admin/assessment">Assessment</Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </nav>
      </div>
    </div>
  );
}
export default Layout;