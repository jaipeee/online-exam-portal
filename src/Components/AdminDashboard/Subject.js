import { useState, useEffect } from "react";
import { database } from "../../config/firebaseConfig";
import { ref, get, update, remove } from "firebase/database";
import "../../styles/Subject.css"; 
import Layout from "../../Layout/Layout";
import Navbar from "../../Layout/Navbar";

function Subject() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [subject, setSubject] = useState("");
  const [studentSubjects, setStudentSubjects] = useState([]);

  useEffect(() => {
    async function fetchStudents() {
      const studentsRef = ref(database, "students");
      const snapshot = await get(studentsRef);
      const studentsList = snapshot.val() ? Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
      })) : [];
      setStudents(studentsList);
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    async function fetchSubjects() {
      if (!selectedStudent) return;
      const subjectsRef = ref(database, `students/${selectedStudent}/subjects`);
      const snapshot = await get(subjectsRef);
      
      const studentData = snapshot.val();
      const subjectList = studentData ? Object.keys(studentData) : []; 
      
      setStudentSubjects(subjectList);
    }
    fetchSubjects();
  }, [selectedStudent]);

  async function handleAddSubject() {
    if (!selectedStudent || subject.trim() === "") {
      alert("Please select a student and enter a subject.");
      return;
    }

    const studentRef = ref(database, `students/${selectedStudent}/subjects`);
    
    await update(studentRef, {
      [subject]: true,
    });

    alert("Subject assigned successfully!");
    setSubject("");
    setStudentSubjects((prevSubjects) => [...prevSubjects, subject]);
  }

  async function handleDeleteSubject(subjectToDelete) {
    if (!selectedStudent || !subjectToDelete) return;

    const subjectRef = ref(database, `students/${selectedStudent}/subjects/${subjectToDelete}`);
    await remove(subjectRef); // Correct deletion function

    setStudentSubjects((prevSubjects) => prevSubjects.filter(subj => subj !== subjectToDelete));
    alert("Subject deleted successfully!");
  }

  async function handleEditSubject(oldSubject) {
    if (!selectedStudent || !oldSubject) return;

    const newSubject = prompt("Enter the new subject name:", oldSubject);
    if (!newSubject || newSubject.trim() === "" || newSubject === oldSubject) return;

    const studentSubjectsRef = ref(database, `students/${selectedStudent}/subjects`);
    const snapshot = await get(studentSubjectsRef);
    const subjectsData = snapshot.val();

    if (subjectsData) {
      delete subjectsData[oldSubject];
      subjectsData[newSubject] = true;
      await update(studentSubjectsRef, subjectsData);
    }

    setStudentSubjects((prevSubjects) =>
      prevSubjects.map((subj) => (subj === oldSubject ? newSubject : subj))
    );
    alert("Subject updated successfully!");
  }

  return (
    <>
      <Navbar />
      <Layout>
        <div className="subject-content">
          <h2>Admin Panel - Assign Subjects to Students</h2>
          <label>Select Student:</label>
          <select onChange={(e) => setSelectedStudent(e.target.value)}>
            <option value="">Select Student</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>

          <input type="text" placeholder="Enter Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <button onClick={handleAddSubject}>Add Subject</button>

          <h3>Assigned Subjects</h3>
          <ul>
            {studentSubjects.length > 0 ? (
              studentSubjects.map((subj, index) => (
                <li key={index}>
                  {subj} 
                  <button onClick={() => handleEditSubject(subj)} style={{ marginLeft: "10px", color: "blue" }}>Edit</button>
                  <button onClick={() => handleDeleteSubject(subj)} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
                </li>
              ))
            ) : (
              <li>No subjects assigned</li>
            )}
          </ul>
        </div>
      </Layout>
    </>
  );
}

export default Subject;