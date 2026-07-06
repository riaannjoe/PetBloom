import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center p-6 dark:bg-midnight-forest text-center animate-spring-bounce">
      <Card variant="default" className="max-w-md w-full p-8 shadow-xl flex flex-col items-center gap-4">
        <h1 className="text-4xl font-extrabold text-bloom-rose font-display">404</h1>
        <h2 className="text-xl font-bold text-deep-charcoal font-display dark:text-frosted-pearl">
          Page Not Found
        </h2>
        <p className="text-sm text-warm-slate max-w-sm mb-4 dark:text-frosted-pearl/60">
          The page you are looking for doesn't exist or has been moved to another section.
        </p>
        <Link to="/dashboard" className="w-full">
          <Button variant="primary" fullWidth className="cursor-pointer">
            Back to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
};
export default NotFoundPage;
