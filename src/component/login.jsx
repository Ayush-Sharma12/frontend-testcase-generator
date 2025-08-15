
import { api_base } from "./const";


export default function Login() {
    

    const loginWithGitHub = () => {
    window.location.href = `${api_base}/api/auth/github`;
  };
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome to Test Case Generator</h2>
                <p style={styles.subtitle}>Generate AI-powered test cases from your GitHub repos in seconds</p>

                <button style={styles.githubButton}   onClick={loginWithGitHub}>
                    <img
                        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                        alt="GitHub"
                        style={styles.githubLogo}
                    />
                    Login with GitHub
                </button>
            </div>
        </div>
    );
}

const styles = {
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
        fontSize: "1.8rem",
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
};
