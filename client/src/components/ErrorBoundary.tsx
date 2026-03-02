import { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "#060B18",
            color: "#EFF4FC",
            fontFamily: "'DM Sans', sans-serif",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <img src="/codnexiafav.png" alt="Codnexia" style={{ width: 52, height: 52, marginBottom: 24 }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: "#8A96B0", marginBottom: 24, maxWidth: 400 }}>
            An unexpected error occurred. Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #1E3A8A, #2DD4A8)",
              color: "#EFF4FC",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
