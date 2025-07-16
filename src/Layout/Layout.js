import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  const location = useLocation();
  const isStudentRoute = location.pathname.startsWith("/student");
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="layout">
      {isAdminRoute && <Navbar />}
      {isStudentRoute && <Sidebar />}
      <div className="content">{children}</div>
    </div>
  );
}

export default Layout;