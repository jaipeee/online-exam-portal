import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import style from "./AdminLogin.module.css";
import { NavLink } from "react-router-dom"; 

function AdminLogin() {
    const [admin, setAdmin] = useState({
      email: "",
      password: "",
    });
  
    const navigate = useNavigate(); 
  
    function handleInput(e) {
      setAdmin({
        ...admin,
        [e.target.name]: e.target.value,
      });
    }
  
    async function login(e) {
      e.preventDefault();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, admin.email, admin.password);
        const user = userCredential.user;

        // Ensure only the admin email can log in
        if (user.email === "jai@gmail.com") { 
          alert("Admin Login Successful!");
          navigate("/admin/dashboard"); 
        } else {
          alert("Access Denied! You are not an admin.");
        }
      } catch (error) {
        console.error("Error logging in:", error.message);
        alert(error.message); // Display Firebase error messages
      }
    }
  
    return (
      <div className={style.adminLoginBody}>
        <div className={style.adminContainer}>
          <div className={style.adminHeadingBox}>
            <h1>Admin Login</h1>
          </div>
  
          <div className={style.adminInputBox}>
            <label htmlFor="email">
              Email
              <input name="email" onChange={handleInput} type="email" />
            </label>
          </div>
  
          <div className={style.adminInputBox}>
            <label htmlFor="password">
              Password
              <input name="password" onChange={handleInput} type="password" />
            </label>
          </div>
  
          <button onClick={login} className={style.adminLoginBtn}>Login</button>

          {/* Go Back Button */}
          <NavLink to="/" className={style.goBackBtn}>Go Back</NavLink>
        </div>
      </div>
    );
}

export default AdminLogin;