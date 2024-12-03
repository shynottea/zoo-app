
import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Result
          status="error"
          title="Something went wrong."
          extra={[
            <Button type="primary" onClick={this.handleReload}>
              Reload Page
            </Button>,
          ]}
        />
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
