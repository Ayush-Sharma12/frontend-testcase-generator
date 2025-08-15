import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Repos() {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (token) {
      axios
        .get(`http://localhost:5000/api/github/repos?page=${page}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("github_token")}` },
        })
        .then((res) => {
          console.log(res, "ayushh----->")
          if (res.status == 200) {
            setRepos(res.data.repos);
            setHasMore(res.data.hasMore);
          }

        })
        .catch((err) => console.error(err));
    }
  }, [page]);

  return (
    <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>📂 Repositories (Page {page})</h2>

                {repos.length === 0 ? (
                    <p style={styles.emptyText}>No repositories found.</p>
                ) : (
                    <div style={styles.repoList}>
                        {repos.map((repo) => (
                            <div key={repo.id} style={styles.repoItem}>
                                <span style={styles.repoName}>{repo.name}</span>
                                <button
                                    style={styles.button}
                                    onClick={() =>
                                        navigate("/repos/files", {
                                            state: { repo },
                                        })
                                    }
                                >
                                    View Files
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={styles.pagination}>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        style={{
                            ...styles.navButton,
                            opacity: page === 1 ? 0.5 : 1,
                            cursor: page === 1 ? "not-allowed" : "pointer",
                        }}
                    >
                        ⬅ Previous
                    </button>
                    <button
                        disabled={!hasMore}
                        onClick={() => setPage((p) => p + 1)}
                        style={{
                            ...styles.navButton,
                            opacity: !hasMore ? 0.5 : 1,
                            cursor: !hasMore ? "not-allowed" : "pointer",
                        }}
                    >
                        Next ➡
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
  repo: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: "400px",
    margin: "10px auto",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#0366d6",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  navButton: {
    backgroundColor: "#333",
    color: "white",
    border: "none",
    padding: "8px 12px",
    margin: "0 5px",
    borderRadius: "4px",
    cursor: "pointer",
  },
   container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f4f8, #d9e4ec)",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "20px",
    },
    card: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "600px",
    },
    title: {
        fontSize: "1.5rem",
        marginBottom: "20px",
        color: "#333",
        textAlign: "center",
    },
    emptyText: {
        textAlign: "center",
        color: "#777",
        fontSize: "1rem",
    },
    repoList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    repoItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    },
    repoName: {
        fontSize: "1rem",
        color: "#444",
    },
    button: {
        backgroundColor: "#4ca1af",
        color: "white",
        padding: "6px 12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "background 0.3s ease",
    },
    pagination: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    navButton: {
        backgroundColor: "#4ca1af",
        color: "white",
        padding: "8px 14px",
        border: "none",
        borderRadius: "6px",
        fontSize: "0.9rem",
        transition: "background 0.3s ease",
    },
};
