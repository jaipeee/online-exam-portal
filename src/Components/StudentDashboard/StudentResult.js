import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig"; 
import { getDatabase, ref, get } from "firebase/database";
import "../../styles/StudentResult.css"; // Ensure you create this CSS file

function StudentResult() {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [overallStats, setOverallStats] = useState(null);

  const auth = getAuth();
  const database = getDatabase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchResults(user.uid);
      } else {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchResults = async (studentId) => {
    try {
      const snapshot = await get(ref(database, `students/${studentId}/results`));
      if (snapshot.exists()) {
        let resultArray = [];
        let totalQuestions = 0, attemptedQuestions = 0, correctAnswers = 0;

        snapshot.forEach((subjectSnapshot) => {
          let subject = subjectSnapshot.key;
          let subjectData = subjectSnapshot.val();

          if (subjectData && typeof subjectData === "object") {
            let { total = 0, attempted = 0, correct = 0 } = subjectData;
            totalQuestions += total;
            attemptedQuestions += attempted;
            correctAnswers += correct;

            resultArray.push({ subject, total, attempted, correct });
          }
        });

        setResults(resultArray);

        if (totalQuestions > 0) {
          let percentage = (correctAnswers / totalQuestions) * 100;
          let grade = getGrade(percentage);

          setOverallStats({
            totalQuestions,
            attemptedQuestions,
            correctAnswers,
            percentage,
            grade,
          });
        }
      } else {
        setResults([]);
        setOverallStats(null);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return "O";
    if (percentage >= 80) return "A+";
    if (percentage >= 70) return "A";
    if (percentage >= 60) return "B+";
    if (percentage >= 50) return "B";
    if (percentage >= 40) return "C";
    return "Fail";
  };

  return (
    <div className="h2">
      <h2>Your Exam Results</h2>
    <div className="result-container">

      {results.length > 0 ? (
        <>
          {results.map((res, index) => (
            <div key={index} className="result-box">
              <strong>{res.subject}:</strong>
              <p>Total Questions: {res.total}</p>
              <p>Attempted: {res.attempted}</p>
              <p>Correct: {res.correct}</p>
              <p>Score: {res.correct} / {res.total}</p>
            </div>
          ))}

          {overallStats && (
            <div className="result-box overall">
              <h3>Overall Performance</h3>
              <p>Attempted Questions: {overallStats.attemptedQuestions} / {overallStats.totalQuestions}</p>
              <p>Correct Answers: {overallStats.correctAnswers} / {overallStats.totalQuestions}</p>
              <p>Percentage: {overallStats.percentage.toFixed(2)}%</p>
              <p>Grade: <strong>{overallStats.grade}</strong></p>
            </div>
          )}
        </>
      ) : (
        <p>No results available.</p>
      )}

      <button className="logout-btn" onClick={() => signOut(auth).then(() => (window.location.href = "/login"))}>
        Logout
      </button>
    </div>
    </div>
  );
}

export default StudentResult;