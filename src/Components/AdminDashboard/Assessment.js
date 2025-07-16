import { useEffect, useState } from "react";
import { ref, get, update, remove } from "firebase/database";
import { database } from "../../config/firebaseConfig";
import Layout from "../../Layout/Layout";
import "../../styles/Assessment.css";

function Assessment() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const snapshot = await get(ref(database, "students"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const studentList = Object.entries(data).map(([id, info]) => ({
          id,
          ...info,
        }));
        setStudents(studentList);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!selectedStudent) return;
    const fetchSubjects = async () => {
      const snapshot = await get(ref(database, `students/${selectedStudent}/subjects`));
      if (snapshot.exists()) {
        setSubjects(Object.keys(snapshot.val()));
      } else {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, [selectedStudent]);

  useEffect(() => {
    if (!selectedStudent || !selectedSubject) return;
    const fetchQuestions = async () => {
      const snapshot = await get(ref(database, `students/${selectedStudent}/mcqs/${selectedSubject}`));
      if (snapshot.exists()) {
        const qList = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
        setQuestions(qList);
      } else {
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, [selectedSubject, selectedStudent]);

  const handleDeleteQuestion = async (questionId) => {
    if (!selectedStudent || !selectedSubject) return;
    const questionRef = ref(database, `students/${selectedStudent}/mcqs/${selectedSubject}/${questionId}`);
    await remove(questionRef);
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
    alert("Question deleted successfully!");
  };

  const handleEditQuestion = async (questionId, oldQuestion) => {
    const newQuestion = prompt("Edit question:", oldQuestion);
    if (!newQuestion || newQuestion === oldQuestion) return;
    if (!selectedStudent || !selectedSubject) return;
    const questionRef = ref(database, `students/${selectedStudent}/mcqs/${selectedSubject}/${questionId}`);
    await update(questionRef, { question: newQuestion });
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === questionId ? { ...q, question: newQuestion } : q))
    );
    alert("Question updated successfully!");
  };

  return (
    <Layout>
      <div className="assessment-container">
        <h2>📝 Assessment Viewer</h2>
        <div className="dropdowns">
          <select onChange={(e) => setSelectedStudent(e.target.value)} defaultValue="">
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select onChange={(e) => setSelectedSubject(e.target.value)} defaultValue="">
            <option value="">Select Subject</option>
            {subjects.map((subject, idx) => (
              <option key={idx} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div className="question-list">
          {questions.length > 0 ? (
            questions.map((q, i) => (
              <div className="question-card" key={i}>
                <h3>Q{i + 1}: {q.question}</h3>
                <ul>
                  {q.options?.map((opt, idx) => (
                    <li key={idx}>{idx + 1}. {opt}</li>
                  ))}
                </ul>
                <p className="correct-answer">✔ Correct Answer: {q.correctAnswer}</p>
                {q.selectedAnswer ? (
                  <p className="student-answer">Selected Answer: {q.selectedAnswer}</p>
                ) : (
                  <p className="student-answer">No answer selected</p>
                )}
                <button onClick={() => handleEditQuestion(q.id, q.question)} style={{ marginRight: "10px" }}>Edit</button>
                <button onClick={() => handleDeleteQuestion(q.id)} style={{ color: "red" }}>Delete</button>
              </div>
            ))
          ) : (
            <p>No questions available for this student and subject.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Assessment;