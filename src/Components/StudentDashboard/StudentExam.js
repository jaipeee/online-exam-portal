import React, { useState, useEffect } from "react";
import { auth, db } from "../../config/firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import "../../styles/StudentExam.css";

function StudentExam() {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [studentName, setStudentName] = useState("");

  const auth = getAuth();
  const database = getDatabase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchSubjects(user.uid);
        fetchStudentName(user.uid);
      } else {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSubjects = async (studentId) => {
    try {
      const snapshot = await get(ref(database, `students/${studentId}/subjects`));
      if (snapshot.exists()) {
        setSubjects(Object.keys(snapshot.val()));
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchStudentName = async (studentId) => {
    try {
      const snapshot = await get(ref(database, `students/${studentId}/name`));
      if (snapshot.exists()) {
        setStudentName(snapshot.val());
      }
    } catch (error) {
      console.error("Error fetching student name:", error);
    }
  };

  const loadMCQs = async () => {
    if (!selectedSubject) return;
    try {
      const snapshot = await get(ref(database, `students/${user.uid}/mcqs/${selectedSubject}`));
      if (snapshot.exists()) {
        setMcqs(Object.entries(snapshot.val()).map(([key, value]) => ({ id: key, ...value })));
        setSubmitted(false);
      } else {
        setMcqs([]);
      }
    } catch (error) {
      console.error("Error fetching MCQs:", error);
    }
  };

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const submitExam = async () => {
    if (!selectedSubject) {
      alert("Please select a subject before submitting the exam.");
      return;
    }
    let totalQuestions = mcqs.length;
    let attemptedQuestions = Object.keys(answers).length;
    let correctAnswers = mcqs.reduce((count, question) => {
      return count + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);
    let percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    try {
      await set(ref(database, `students/${user.uid}/results/${selectedSubject}`), {
        total: totalQuestions,
        attempted: attemptedQuestions,
        correct: correctAnswers,
        percentage: percentage,
        answers: answers,
      });
      setSubmitted(true);
      alert("Your exam has been submitted successfully! You can check your result in the Results section.");
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Failed to submit exam. Please try again.");
    }
  };

  return (
    <div className="exam-container">
      <h2>Student Exam</h2>
      {studentName && <p>Welcome, {studentName}!</p>}
      <label>Select Subject:</label>
      <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} onBlur={loadMCQs}>
        <option value="">Select Subject</option>
        {subjects.map((subject, index) => (
          <option key={index} value={subject}>
            {subject}
          </option>
        ))}
      </select>
      <div className="exam-content">
        {submitted ? (
          <p>You have already attempted this subject. Please check another subject.</p>
        ) : mcqs.length > 0 ? (
          mcqs.map((question) => (
            <div key={question.id} className="question-box">
              <p><strong>{question.question}</strong></p>
              {question.options.map((option, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={() => handleOptionChange(question.id, option)}
                  />{" "}
                  {option}
                </div>
              ))}
              <p className="student-answer">
                Selected Answer: {answers[question.id] ? answers[question.id] : "No answer selected"}
              </p>
            </div>
          ))
        ) : (
          <p>No questions available for this subject.</p>
        )}
      </div>
      {!submitted && mcqs.length > 0 && <button className="submit-btn" onClick={submitExam}>Submit Exam</button>}
      <button className="logout-btn" onClick={() => signOut(auth).then(() => (window.location.href = "/login"))}>
        Logout
      </button>
    </div>
  );
}

export default StudentExam;