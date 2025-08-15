import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./loader"; // Assuming you have a loader component
import { api_base } from "./const";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const tokenFromUrl = urlParams.get("token");
    console.log(code, tokenFromUrl, "hhhhhhhh=------>");
    if (code) {
      // Step 1: Send code to backend to get access token
      axios
        .get(`${api_base}/auth/github/callback?code=${code}`)
        .then((res) => {
          const token = res.data.access_token;

          // Step 2: Fetch GitHub user data
          return axios.get("https://api.github.com/user", {
            headers: { Authorization: `token ${token}` },
          });
        })
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Login failed:", err);
          setLoading(false);
        });
    } else if (tokenFromUrl) {
      // If we already have token in URL, fetch user directly
      axios
        .get("https://api.github.com/user", {
          headers: { Authorization: `token ${tokenFromUrl}` },
        })
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("github_token", tokenFromUrl);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <Loader size={50} color="#24292f" borderWidth={4} />;

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>No user logged in</h2>
          <p style={styles.subtitle}>
            Please log in to continue using the Test Case Generator
          </p>

          <a
            href={`${api_base}/api/auth/github`}
            style={{ textDecoration: "none" }}
          >
            <button style={styles.githubButton}>
              <img
                src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                alt="GitHub"
                style={styles.githubLogo}
              />
              Login with GitHub
            </button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={user.avatar_url} alt="avatar" style={styles.avatar} />
        <h2 style={styles.title}>Welcome, {user.login} 👋</h2>
        <p style={styles.info}>
          <strong>Name:</strong> {user.name || "No name provided"}
        </p>
        <p style={styles.info}>
          <strong>Public Repos:</strong> {user.public_repos}
        </p>

        <button style={styles.button} onClick={() => navigate("/repos")}>
          🚀 Go to Repos
        </button>
      </div>
    </div>
  );
}

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#24292f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #2c3e50, #4ca1af)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "1.6rem",
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#666",
    marginBottom: "30px",
  },
  githubButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#24292f",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },
  githubLogo: {
    width: "24px",
    height: "24px",
    marginRight: "10px",
    backgroundColor: "white",
    borderRadius: "50%",
    padding: "2px",
  },
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4ca1af, #2c3e50)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "3px solid #4ca1af",
    marginBottom: "15px",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "15px",
    color: "#333",
  },
  info: {
    fontSize: "1rem",
    color: "#555",
    margin: "8px 0",
  },
  button: {
    marginTop: "20px",
    backgroundColor: "#4ca1af",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};
