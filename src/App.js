import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Components/HomePage";
import AdminLogin from "./Components/AdminAuth/AdminLogin";
import StudentLogin from "./Components/StudentDashboard/StudentAuth/StudentLogin";
import Dashboard from "./Components/AdminDashboard/Dashboard";
import Exam from "./Components/AdminDashboard/Exam";
import Subject from "./Components/AdminDashboard/Subject";
import Assessment from "./Components/AdminDashboard/Assessment";
import StudentDashboard from "./Components/StudentDashboard/StudentDashboard";
import StudentExam from "./Components/StudentDashboard/StudentExam";
import StudentResult from "./Components/StudentDashboard/StudentResult";
import Layout from "./Layout/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/admin/*" element={<Layout><Routes>
          <Route path="assessment" element={<Assessment />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="subjects" element={<Subject />} />
          <Route path="exam" element={<Exam />} />
        </Routes></Layout>} />
        <Route path="/student/*" element={<Layout><Routes>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="result" element={<StudentResult />} />
          <Route path="exam" element={<StudentExam />} />
        </Routes></Layout>} />
        <Route path="/Dashboard" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;