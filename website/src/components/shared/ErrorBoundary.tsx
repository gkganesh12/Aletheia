import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: "#0a0e1a",
            color: "#ffffff",
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              padding: "3rem 2rem",
              borderRadius: "1rem",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                margin: "0 auto 1.5rem",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 212, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
              }}
            >
              !
            </div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(255, 255, 255, 0.5)",
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              An unexpected error occurred. Please try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                backgroundColor: "rgba(0, 212, 255, 0.1)",
                color: "#00d4ff",
                fontSize: "0.95rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(0, 212, 255, 0.2)";
                e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(0, 212, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(0, 212, 255, 0.3)";
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
