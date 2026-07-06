import React from 'react';
import { PageWrapper } from '@/layouts/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotificationStore } from '@/store/notificationStore';

export const SettingsPage: React.FC = () => {
  const addToast = useNotificationStore((s) => s.addToast);

  const saveSettings = () => {
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your application preferences have been updated.'
    });
  };

  return (
    <PageWrapper
      title="Settings"
      subtitle="Manage your profile settings, units preferences, and push reminder rules"
      action={
        <Button variant="primary" onClick={saveSettings} className="cursor-pointer">
          Save Changes
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card variant="default">
          <h3 className="text-base font-bold text-deep-charcoal font-display mb-4 dark:text-frosted-pearl">
            General Preferences
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center pb-4 border-b border-deep-charcoal/5 dark:border-white/5">
              <div>
                <h4 className="text-sm font-semibold text-deep-charcoal dark:text-frosted-pearl">
                  Measurement Unit
                </h4>
                <p className="text-xs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                  Set metric or imperial systems for weight and food quantities
                </p>
              </div>
              <select className="bg-warm-cream px-3 py-1.5 rounded-lg text-xs font-semibold dark:bg-white/5 dark:text-frosted-pearl border-none outline-none">
                <option>Metric (kg / ml)</option>
                <option>Imperial (lbs / oz)</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-semibold text-deep-charcoal dark:text-frosted-pearl">
                  Automatic Reminders
                </h4>
                <p className="text-xs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                  Receive browser notifications for due feeding and medications
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-bloom-rose focus:ring-bloom-rose accent-bloom-rose cursor-pointer" />
            </div>
          </div>
        </Card>

        <Card variant="default">
          <h3 className="text-base font-bold text-deep-charcoal font-display mb-4 dark:text-frosted-pearl">
            Security & Integrations
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-semibold text-deep-charcoal dark:text-frosted-pearl">
                API Tokens
              </h4>
              <p className="text-xs text-warm-slate dark:text-frosted-pearl/60 mt-0.5 mb-3">
                Configure third-party services integrations (Fitbark, Whistle, smart feeders)
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Connect Smart Collar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
};
export default SettingsPage;
