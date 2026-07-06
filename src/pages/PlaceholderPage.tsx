import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';

interface PlaceholderPageProps {
  title: string;
  module: string;
}

export function PlaceholderPage({ title, module }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            The {module} module will be implemented in a future phase. Application
            foundation is ready.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
