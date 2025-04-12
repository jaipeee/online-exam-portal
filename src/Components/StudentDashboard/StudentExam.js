import React, { useState, useEffect } from "react";
import { auth, db } from "../../config/firebaseConfig"; 
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import "../../styles/StudentExam.css"; // Ensure you create this CSS file

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

  // Check Authentication & Fetch Subjects
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchSubjects(user.uid);
        fetchStudentName(user.uid);
      } else {
        window.location.href = "/login"; // Redirect to login page
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Subjects from Firebase
  const fetchSubjects = async (studentId) => {
    try {
      const snapshot = await get(ref(database, `students/${studentId}/subjects`));
      if (snapshot.exists()) {
        setSubjects(Object.keys(snapshot.val())); // Fixed: Using Object.keys to get subject names
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

  // Load MCQs for selected subject
  const loadMCQs = async () => {
    if (!selectedSubject) return;

    try {
      const snapshot = await get(ref(database, `students/${user.uid}/mcqs/${selectedSubject}`));
      if (snapshot.exists()) {
        setMcqs(Object.entries(snapshot.val()).map(([key, value]) => ({ id: key, ...value })));
        setSubmitted(false); // Reset submission status
      } else {
        setMcqs([]);
      }
    } catch (error) {
      console.error("Error fetching MCQs:", error);
    }
  };

  // Handle Option Selection
  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,  // Updating the selected answer for this question
    }));
  };

  // Submit Exam
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
        answers: answers,  // Ensure the answers are saved here
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
                    checked={answers[question.id] === option}  // Check if the current option is the selected answer
                    onChange={() => handleOptionChange(question.id, option)}  // Update the selected answer
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