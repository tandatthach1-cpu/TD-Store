// ErrorBoundary.jsx
// Simple React error boundary to catch rendering errors in child components.
// Wraps children and displays a fallback UI when an error occurs.

import React from "react";

const isDevelopment = import.meta.env.DEV;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an external service here.
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Simple fallback UI – you can customize styling as needed.
      return (
        <div className="p-4 text-center text-red-600">
          <p>Đã xảy ra lỗi khi hiển thị sản phẩm.</p>
          {/* Optional: show error message for debugging */}
          {isDevelopment && (
            <pre className="mt-2 text-left text-xs whitespace-pre-wrap">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
