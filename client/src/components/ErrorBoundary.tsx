import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
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
        <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold text-[#EF4444] mb-4 tracking-tighter">System Offline</h1>
            <p className="text-[#9CA3AF] mb-6">
              The 3D engine encountered a critical error. This can be caused by WebGL context loss or a component crash.
            </p>
            <pre className="bg-white/5 p-4 rounded text-xs text-left overflow-auto max-h-48 mb-6 text-[#6B7280]">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#3B82F6] text-white rounded-full font-bold shadow-lg shadow-blue-500/20"
            >
              Restart Engine
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
