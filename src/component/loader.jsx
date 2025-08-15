export default function Loader({ size = 16, color = "#333", borderWidth = 2 }) {
    return (
        <div
            style={{
                height: "100vh", // Full viewport height
                display: "flex",
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional overlay
            }}
        >
            <span
                style={{
                    border: `${borderWidth}px solid #ccc`,
                    borderTop: `${borderWidth}px solid ${color}`,
                    borderRadius: "50%",
                    width: `${size}px`,
                    height: `${size}px`,
                    display: "inline-block",
                    animation: "spin 1s linear infinite",
                }}
            />
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
}
