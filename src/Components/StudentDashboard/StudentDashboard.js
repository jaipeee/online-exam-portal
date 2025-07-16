import { useState, useEffect } from "react";
import { auth, database } from "../../config/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "../../styles/StudentDashboard.css";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        await fetchUserName(user.uid);
        await fetchSubjects(user.uid);
      } else {
        navigate("/StudentLogin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  async function fetchUserName(studentId) {
    try {
      const userRef = ref(database, `students/${studentId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUserName(userData.name);
        setUserEmail(userData.email);
      } else {
        console.warn("No user data found in Realtime Database.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function fetchSubjects(studentId) {
    try {
      const subjectsRef = ref(database, `students/${studentId}/subjects`);
      const snapshot = await get(subjectsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const subjectsList = Object.keys(data);
        setSubjects(subjectsList);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }

  function logout() {
    auth.signOut().then(() => navigate("/StudentLogin"));
  }

  return (
    <div className="student-dashboard">
      <h2>Welcome, {userName || "Student"}!</h2>
      <p>Email: {userEmail || "Not available"}</p>
      <div className="subject-list">
        <h3>Your Subjects</h3>
        <ul>
          {subjects.length > 0 ? (
            subjects.map((subject, index) => <li key={index}>{subject}</li>)
          ) : (
            <li>No subjects assigned</li>
          )}
        </ul>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default StudentDashboard;