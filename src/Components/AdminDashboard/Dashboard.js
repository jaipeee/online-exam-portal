import { useEffect, useState } from "react";
import { ref, get, remove } from "firebase/database";
import { database } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";
import Layout from "../../Layout/Layout";

function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsRef = ref(database, "students");
      const snapshot = await get(studentsRef);
      if (snapshot.exists()) {
        const studentData = snapshot.val();
        const studentList = Object.keys(studentData).map((id) => ({
          id,
          ...studentData[id],
        }));
        setStudents(studentList);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const indianTime = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });
      setCurrentTime(indianTime);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await remove(ref(database, `students/${studentId}`));
        setStudents((prevStudents) => prevStudents.filter((s) => s.id !== studentId));
        alert("Student deleted successfully.");
      } catch (error) {
        alert("Failed to delete student: " + error.message);
      }
    }
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h2 className="dashboard-h2">Online Examination Portal</h2>
          <p className="indian-time">Current Indian Time: {currentTime}</p>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <h1>Welcome to the Admin Dashboard</h1>
          <h2>Logged-in Students:</h2>
          <ul className="student-list">
            {students.length > 0 ? (
              students.map((student, index) => (
                <li key={index} className="student-item">
                  <div className="student-name">Name: {student.name}</div>
                  <div className="student-email">Email: {student.email}</div>
                  <div className="student-joined">
                    Joined: {new Date(student.dateAdded).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </div>
                  <div className="student-subjects">
                    Subjects: {student.subjects ? Object.keys(student.subjects).join(", ") : "No subjects assigned"}
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteStudent(student.id)}>
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <p>No students have logged in yet.</p>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;