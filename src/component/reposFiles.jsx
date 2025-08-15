import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./loader"; // Assuming you have a loader component
import { api_base } from "./const";

export default function RepoFiles() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { repo } = location.state || {}; // repo object from Repos.js

  const [files, setFiles] = useState([]);
  
  const [path, setPath] = useState("");
  const [viewContent, setViewContent] = useState(null);
  const [testCases, setTestCases] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("github_token");

  useEffect(() => {
    if (!repo || !repo.owner?.login) return;

    axios
      .get(
        `${api_base}/api/github/repos/${repo.owner.login}/${repo.name}/contents`,
        {
          params: { path },
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => setFiles(res.data))
      .catch((err) => console.error(err));
  }, [repo, path, token]);

  const navigateFolder = (folderPath) => {
    setPath(folderPath);
  };

  const selectFile = (filePath) => {
    navigate("/repos/testcases", {
      state: { repo, filePath },
    });
  };

  // View file content
  const handleViewFile = async (filePath) => {
    setLoading(true);
    setViewContent(null);
    try {
      const res = await axios.get(
        `${api_base}/api/github/repos/${repo.owner.login}/${repo.name}/file?path=${filePath}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setViewContent(res.data.content);
      setTestCases(null);
    } catch (err) {
      console.error(err);
      alert("Failed to load file");
    }
    setLoading(false);
  };

  // Generate test cases
  const handleGenerateTestCases = async (filePath) => {
    setLoading(true);
    setTestCases(null);
    try {
      const res = await axios.post(
        `${api_base}/api/github/repos/${repo.owner.login}/${repo.name}/generate-testcases`,
        { path: filePath },
        {
          headers: {
            "Content-Type": "application/json", // <-- important
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTestCases(res.data.testCases);
      setViewContent(null);
    } catch (err) {
      console.error(err);
      alert(err?.message);
    }
    setLoading(false);
  };

  if (!repo) {
    return <h3>No repository data provided.</h3>;
  }

   const handleCopy = () => {
        if (typeof viewContent === "object") {
            navigator.clipboard.writeText(JSON.stringify(viewContent, null, 2));
        } else {
            navigator.clipboard.writeText(viewContent);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };




    if(loading)
    {
        return <Loader size={32} color="#0366d6" borderWidth={3} />;
    }
  return (
    <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>📁 Files in {repo.full_name}</h2>

                <div style={styles.navRow}>
                    <button style={styles.navButton} onClick={() => navigate(-1)}>
                        ← Back to Repos
                    </button>
                    {path && (
                        <button style={styles.navButton} onClick={() => setPath("")}>
                            ⬆ Go to Root
                        </button>
                    )}
                </div>

                {files.length === 0 ? (
                    <p style={styles.emptyText}>No files found in this directory.</p>
                ) : (
                    <ul style={styles.fileList}>
                        {files.map((file) => (
                            <li key={file.path} style={styles.fileItem}>
                                {file.type === "dir" ? (
                                    <button
                                        style={styles.folderBtn}
                                        onClick={() => navigateFolder(file.path)}
                                    >
                                        📂 {file.name}
                                    </button>
                                ) : (
                                    <>
                                        <span style={styles.fileName}>📄 {file.name}</span>
                                        <div style={styles.actionButtons}>
                                            <button
                                                style={styles.fileBtn}
                                                onClick={() => handleGenerateTestCases(file.path)}
                                            >
                                                🧪 Generate Test Cases
                                            </button>
                                            <button
                                                style={styles.viewBtn}
                                                onClick={() => handleViewFile(file.path)}
                                            >
                                                👁 View
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {/* File Viewer */}
                {viewContent && (
                    <div style={styles.viewer}>
                        <div style={styles.viewerHeader}>
                            <h3 style={{ margin: 0 }}>📄 File Content</h3>
                            <button
                                onClick={handleCopy}
                                style={styles.copyBtn}
                                title="Copy to clipboard"
                            >
                                📋
                            </button>
                        </div>
                        {copied && <span style={styles.copiedMsg}>Copied!</span>}
                        <pre style={styles.codeBlock}>
                            {typeof viewContent === "object"
                                ? JSON.stringify(viewContent, null, 2)
                                : viewContent}
                        </pre>
                    </div>
                )}

                {/* Test Cases Viewer */}
                {testCases && (
                    <div style={styles.viewer}>
                        <h3>🧪 Generated Test Cases</h3>
                        <pre style={styles.codeBlock}>
                            {JSON.stringify(testCases, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
  
}

const styles = {
  folderBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    color: "#0366d6",
  },
  fileBtn: {
    background: "#0366d6",
    color: "#fff",
    border: "none",
    padding: "4px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  viewBtn: {
    background: "#555",
    color: "#fff",
    border: "none",
    padding: "4px 10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
   container: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f8, #d9e4ec)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "800px",
    },
    title: {
        fontSize: "1.4rem",
        marginBottom: "15px",
        color: "#333",
        textAlign: "center",
    },
    navRow: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
    },
    navButton: {
        backgroundColor: "#4ca1af",
        color: "white",
        padding: "8px 14px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    emptyText: {
        textAlign: "center",
        color: "#777",
    },
    fileList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    fileItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    },
    folderBtn: {
        background: "transparent",
        border: "none",
        color: "#007bff",
        cursor: "pointer",
        fontSize: "1rem",
        textAlign: "left",
    },
    fileName: {
        flex: 1,
        color: "#444",
    },
    actionButtons: {
        display: "flex",
        gap: "8px",
    },
    fileBtn: {
        backgroundColor: "#ff9800",
        color: "white",
        padding: "6px 10px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    viewBtn: {
        backgroundColor: "#4caf50",
        color: "white",
        padding: "6px 10px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    viewer: {
        marginTop: "20px",
    },
    viewerHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    copyBtn: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: "16px",
    },
    copiedMsg: {
        color: "green",
        fontSize: "0.9rem",
    },
    codeBlock: {
        background: "#f4f4f4",
        padding: "10px",
        borderRadius: "5px",
        overflowX: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        maxHeight: "400px",
        overflowY: "auto",
        fontSize: "0.85rem",
    },
};
