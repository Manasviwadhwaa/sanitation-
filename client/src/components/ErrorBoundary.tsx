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
        <div className="min-h-screen bg-[#fcf8fa] flex items-center justify-center p-8 text-center relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
          
          <div className="max-w-xl w-full relative z-10 glass-panel rounded-[3rem] p-12 shadow-[0px_40px_100px_rgba(0,0,0,0.05)]">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
               <span className="material-symbols-outlined text-4xl font-bold">error_outline</span>
            </div>
            
            <h1 className="text-4xl font-bold text-black mb-4 tracking-tighter">System Offline</h1>
            <p className="text-gray-400 font-medium mb-8 uppercase tracking-widest text-[10px]">
              Engine Encountered a Critical Exception
            </p>
            
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl text-left overflow-auto max-h-48 mb-10 shadow-inner">
               <div className="text-[10px] font-bold text-gray-300 uppercase mb-3">Diagnostic Trace</div>
               <code className="text-xs text-red-600 font-mono break-all leading-relaxed">
                 {this.state.error?.message}
               </code>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Restart Sanitrax Engine
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
