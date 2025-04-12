import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../../../config/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import "../../../styles/StudentLogin.css";

function StudentLogin() {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setStudent({ ...student, [e.target.name]: e.target.value });
  }

  async function signUp(e) {
    e.preventDefault();
    if (student.email === "jai@gmail.com") {
      alert("Admin email cannot be used for student registration.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, student.email, student.password);
      const user = userCredential.user;

      await set(ref(database, `students/${user.uid}`), {
        name: student.name,
        email: student.email,
        dateAdded: new Date().toISOString(),
      });

      alert("User registered successfully!");
      navigate("/student/dashboard"); 
    } catch (error) {
      alert(error.message);
    }
  }

  async function login(e) {
    e.preventDefault();
    if (student.email === "jai@gmail.com") {
      alert("Admin email cannot be used for student login.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, student.email, student.password);
      alert("Login successful!");
      navigate("/student/dashboard"); 
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="h2style">
      <h2>Student Login & Signup</h2>
      
    <div className="student-login-container">
      <div className="form-container">
        <div className="left-side">
          <h3>Login</h3>
          <input type="email" name="email" placeholder="Enter Email" onChange={handleChange} />
          <input type="password" name="password" placeholder="Enter Password" onChange={handleChange} />
          <button onClick={login}>Login</button>
        </div>

        <div className="right-side">
          <h3>Sign Up</h3>
          <input type="text" name="name" placeholder="Enter Name" onChange={handleChange} />
          <input type="email" name="email" placeholder="Enter Email" onChange={handleChange} />
          <input type="password" name="password" placeholder="Enter Password" onChange={handleChange} />
          <button onClick={signUp}>Sign Up</button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default StudentLogin;