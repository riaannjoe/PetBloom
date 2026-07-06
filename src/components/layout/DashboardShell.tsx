import type { ReactNode } from 'react';
import { Card, CardDescription, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { usePetStore } from '@/stores/petStore';
import { formatDate } from '@/lib/utils';

interface DashboardShellProps {
  children?: ReactNode;
}

function PlaceholderPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card variant="glass" className="h-full min-h-[200px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </Card>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  const user = usePetStore((s) => s.user);
  const activePet = usePetStore((s) => s.getActivePet());
  const isLoading = usePetStore((s) => s.isLoading);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {/* AI Concierge greeting header — shell only */}
      <Card variant="elevated" className="border-bloom-rose/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-warm-slate dark:text-frosted-pearl/70">
              {formatDate(new Date())}
            </p>
            <h1 className="font-display text-2xl font-medium text-deep-charcoal md:text-3xl dark:text-frosted-pearl">
              {isLoading ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                <>
                  Good Morning, {user?.name?.split(' ')[0] ?? 'there'}! 🌸
                </>
              )}
            </h1>
            {activePet && !isLoading && (
              <p className="mt-2 text-sm text-warm-slate dark:text-frosted-pearl/70">
                Today&apos;s priorities for {activePet.name} will appear here once
                modules are connected.
              </p>
            )}
          </div>
        </div>
      </Card>

      {children ?? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PlaceholderPanel
              title="Daily Care Checklist"
              description="Schedule timeline — coming in Daily Planner module"
            />
          </div>
          <div className="lg:col-span-1">
            <PlaceholderPanel
              title="Cognitive Health"
              description="AI insights and alerts — coming in Health module"
            />
          </div>
          <div className="lg:col-span-1">
            <PlaceholderPanel
              title="Food Inventory"
              description="Stock levels and reorder alerts — coming in Nutrition module"
            />
          </div>
        </div>
      )}
    </div>
  );
}
