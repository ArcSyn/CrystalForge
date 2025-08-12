import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Crystal Forge Error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="size-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Crystal Shattered!</h1>
            </div>
            
            <p className="text-zinc-400 mb-4">
              The Crystal Forge encountered an unexpected error. The mystical energies need to be realigned.
            </p>
            
            {this.state.error && (
              <details className="mb-6">
                <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-300">
                  View error details
                </summary>
                <pre className="mt-2 p-3 bg-zinc-800 rounded-lg text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              <RefreshCw className="size-4" />
              Reforge the Crystal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
