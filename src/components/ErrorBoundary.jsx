import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "20px", textAlign: "center", color: "#ef4444" }}>
                    <h2>Something went wrong.</h2>
                    <p>Please refresh the page or try a different skill.</p>
                    <details style={{ whiteSpace: "pre-wrap", marginTop: "10px", color: "#64748b" }}>
                        {this.state.error && this.state.error.toString()}
                    </details>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            background: "#0ea5e9",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
