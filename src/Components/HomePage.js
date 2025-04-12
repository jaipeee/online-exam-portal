import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Online Examination Portal</h1>
      <div style={styles.buttonContainer}>
        <button onClick={() => navigate("/student/login")} style={styles.button}>Student Login</button>
        <button onClick={() => navigate("/admin/login")} style={styles.button}>Admin Login</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  heading: {
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "18px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
  },
};

export default HomePage;