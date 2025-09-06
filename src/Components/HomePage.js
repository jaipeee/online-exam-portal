import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../styles/HomePage.css";


function HomePage() {

const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();


  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <h1 className="title">Welcome to Online Examination Portal</h1>

      <button  className="square" onClick={() => navigate("/student/login")} >Student Login</button>
        <button  className="square" onClick={() => navigate("/admin/login")} >Admin Login</button>

      <div className="icons">
        <svg
          onClick={() => setDarkMode(false)}
          xmlns="http://www.w3.org/2000/svg"
          height="48px"
          viewBox="0 -960 960 960"
          width="48px"
          fill={darkMode ? "#e3e3e3" : "#000"}
        >
          <path d="M481-29 346-160H160v-186L26-480l134-134v-186h186l135-134 133 134h186v186l134 134-134 134v186H614L481-29Zm.05-257Q562-286 619-343.05q57-57.06 57-138Q676-562 618.95-619q-57.06-57-138-57Q400-676 343-618.95q-57 57.06-57 138Q286-400 343.05-343q57.06 57 138 57ZM481-481Zm0 368 107.92-107H740v-151l109-109-109-109v-151H589L481-849 371-740H220v151L111-480l109 109v151h150l111 107Zm-1-368Z" />
        </svg>

        <svg
          onClick={() => setDarkMode(true)}
          xmlns="http://www.w3.org/2000/svg"
          height="48px"
          viewBox="0 -960 960 960"
          width="48px"
          fill={darkMode ? "#e3e3e3" : "#000"}
        >
          <path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 98 11 192.63 29 94.64 100 165.74 71 71.1 165.5 100.14Q781-392.45 880-410.47q-26 144.2-138 237.34Q630-80 484-80Zm0-60q100 0 182-57t132-145q-90-8-173-41.5T478.5-480Q415-543 382-625.5T341-797q-88 48-144.5 130.5T140-484q0 143.33 100.33 243.67Q340.67-140 484-140Zm-6-340Z" />
        </svg>
      </div>

     <section className="about">
        <h2>About Me</h2>
        <p>
          Hi, my name is <strong>Jaipratap Raj</strong>.  
          This project is called <strong>Online Examination Portal</strong>, which I built as my final year project at  
          <strong> SRM Institute of Science and Technology</strong>.  
        </p>
        <p>
          The portal is developed using <strong>React</strong> for the frontend, and <strong>Firebase</strong> for
          authentication and database management. It allows students to <strong>sign up, log in, and take exams</strong> online in a secure way. 
          The project is currently <strong>being used in institutions</strong> to conduct examinations digitally.
        </p>
        <p className="p-tag">
          Some key features include:
          <ul className="homepage-ul">
            <li>Secure student authentication with Firebase</li>
            <li>User-friendly UI built with React</li>
            <li>Real-time database updates for exams and results</li>
            <li>Scalable cloud-based backend</li>
          </ul>
        </p>
        <p>
          This project represents a step towards <strong>modernizing examination systems</strong> with technology and 
          ensuring accessibility for students and institutions alike.
        </p>
      </section>
    </div>

  );
}

export default HomePage;