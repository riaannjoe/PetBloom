import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  isOffline: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, isOffline: !navigator.onLine };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in PetBloom:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-warm-cream dark:bg-midnight-forest flex items-center justify-center p-6 text-deep-charcoal dark:text-frosted-pearl">
          <Card variant="glass" className="max-w-md w-full p-8 text-center border-red-500/10">
            <div className="p-4 bg-red-500/10 text-red-500 rounded-full w-fit mx-auto mb-5">
              <ShieldAlert size={36} />
            </div>
            
            <h1 className="text-xl font-bold font-display">Something Went Wrong</h1>
            <p className="text-xs text-warm-slate mt-2 mb-6 dark:text-frosted-pearl/70 leading-relaxed">
              We encountered an unexpected error while loading workspace components. Don't worry, your pet care schedules remain safe.
            </p>

            <div className="flex flex-col gap-3">
              <Button variant="primary" onClick={this.handleReload} fullWidth className="flex items-center justify-center gap-1.5 cursor-pointer">
                <RefreshCw size={16} />
                <span>Reload Workspace</span>
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
