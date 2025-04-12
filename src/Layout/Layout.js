import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar"; // Import Sidebar

function Layout({ children }) {
  const location = useLocation();
  const isStudentRoute = location.pathname.startsWith("/student");

  return (
    <div className="layout">
      <Navbar />
      {isStudentRoute && <Sidebar />} {/* Sidebar only for students */}
      <div className="content">{children}</div>
    </div>
  );
}

export default Layout;