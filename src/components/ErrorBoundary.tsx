import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-red-500/20 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-6 text-sm">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="bg-black/30 p-3 rounded-lg text-left mb-6 overflow-auto max-h-32">
              <code className="text-xs text-red-300 font-mono">
                {this.state.error?.message}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition w-full"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
