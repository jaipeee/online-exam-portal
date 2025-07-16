import { useState, useEffect } from "react";
import { ref, get, set, push } from "firebase/database";
import { database } from "../../config/firebaseConfig";
import Layout from "../../Layout/Layout";
import "../../styles/Exam.css";

function Exam() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      const studentsRef = ref(database, "students");
      const snapshot = await get(studentsRef);
      if (snapshot.exists()) {
        const studentsData = snapshot.val();
        const studentsList = Object.keys(studentsData).map(key => ({
          id: key,
          ...studentsData[key],
        }));
        setStudents(studentsList);
      } else {
        console.log("No students found");
      }
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      async function fetchSubjects() {
        const subjectsRef = ref(database, `students/${selectedStudent}/subjects`);
        const snapshot = await get(subjectsRef);
        if (snapshot.exists()) {
          const subjectsList = Object.keys(snapshot.val());
          setSubjects(subjectsList);
        } else {
          setSubjects([]);
        }
      }
      fetchSubjects();
    }
  }, [selectedStudent]);

  async function handleAddQuestion() {
    if (!selectedStudent || !selectedSubject || !question || options.includes("") || !correctAnswer) {
      alert("All fields are required!");
      return;
    }
    const questionsRef = ref(database, `students/${selectedStudent}/mcqs/${selectedSubject}`);
    const newQuestionRef = push(questionsRef);
    await set(newQuestionRef, {
      question,
      options,
      correctAnswer
    });
    alert("Question added successfully!");
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
  }

  return (
    <Layout>
      <div className="exam-content">
        <h2>Admin Panel - Add MCQ Questions</h2>
        <label>Select Student:</label>
        <select onChange={(e) => setSelectedStudent(e.target.value)}>
          <option value="">Select Student</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
        </select>
        <label>Select Subject:</label>
        <select onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjects.map((subject, index) => (
            <option key={index} value={subject}>{subject}</option>
          ))}
        </select>
        <input type="text" placeholder="Enter Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        {options.map((opt, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={opt}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
          />
        ))}
        <input type="text" placeholder="Enter Correct Option (1-4)" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} />
        <button onClick={handleAddQuestion}>Add Question</button>
      </div>
    </Layout>
  );
}

export default Exam;