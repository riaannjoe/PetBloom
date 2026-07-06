import React, { useState } from 'react';
import { usePetStore } from '@/store/petStore';
import { PageWrapper } from '@/layouts/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Sparkles,
  Trophy,
  Activity,
  Calendar,
  AlertTriangle,
  Award,
  Sparkle
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { weeklyReports, pets, activePetId } = usePetStore();
  
  const activePet = pets.find((p) => p.id === activePetId) || pets[0];
  const report = weeklyReports.find((r) => r.petId === activePetId) || weeklyReports[0];

  // Active sub-tab selector
  const [activeReportTab, setActiveReportTab] = useState<'SUMMARY' | 'CHARTS'>('SUMMARY');

  // Heatmap helper (last 14 days)
  const heatmapDays = [
    { date: 'Mon', completed: true, val: 3 },
    { date: 'Tue', completed: true, val: 4 },
    { date: 'Wed', completed: false, val: 1 },
    { date: 'Thu', completed: true, val: 4 },
    { date: 'Fri', completed: true, val: 3 },
    { date: 'Sat', completed: true, val: 5 },
    { date: 'Sun', completed: true, val: 4 },
    { date: 'Mon', completed: true, val: 4 },
    { date: 'Tue', completed: true, val: 3 },
    { date: 'Wed', completed: true, val: 5 },
    { date: 'Thu', completed: false, val: 1 },
    { date: 'Fri', completed: true, val: 4 },
    { date: 'Sat', completed: true, val: 3 },
    { date: 'Sun', completed: true, val: 5 },
  ];

  // AI recommendations
  const aiRecommendations = [
    { text: 'Increase daily hydration: Try adding ice cubes to the water bowl.', status: 'CRITICAL' },
    { text: 'Walk schedule shift: Walk earlier in the morning to beat the heat.', status: 'INFO' },
    { text: 'Maintain current feeding schedule: Calorie ratios look perfect.', status: 'SUCCESS' },
    { text: 'DHPP Vaccination Reminder: Booster is scheduled for next week.', status: 'WARNING' },
  ];

  if (!report) {
    return (
      <PageWrapper
        title="Weekly Bloom Digest"
        subtitle="Review health trends and AI care recommendations"
      >
        <EmptyState
          icon={<Activity size={48} />}
          title="No Weekly Reports Generated"
          description="Reports are generated every Sunday based on daily logged schedules."
          action={<Button variant="primary">Log Today's Care</Button>}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Weekly Bloom Digest"
      subtitle={`Comprehensive wellness metrics, growth curves, and recommendations for ${activePet?.name || 'Max'}`}
    >
      {/* TABS HEADER SELECTOR */}
      <div className="flex gap-2 p-1 bg-deep-charcoal/5 dark:bg-white/5 rounded-2xl w-fit mb-6 select-none">
        <button
          onClick={() => setActiveReportTab('SUMMARY')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition-all
            ${activeReportTab === 'SUMMARY'
              ? 'bg-pure-linen text-deep-charcoal shadow-sm dark:bg-slate-velvet dark:text-frosted-pearl'
              : 'text-warm-slate hover:text-deep-charcoal dark:hover:text-frosted-pearl'
            }
          `}
        >
          <Sparkle size={14} /> AI Wellness Summary
        </button>
        <button
          onClick={() => setActiveReportTab('CHARTS')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition-all
            ${activeReportTab === 'CHARTS'
              ? 'bg-pure-linen text-deep-charcoal shadow-sm dark:bg-slate-velvet dark:text-frosted-pearl'
              : 'text-warm-slate hover:text-deep-charcoal dark:hover:text-frosted-pearl'
            }
          `}
        >
          <Activity size={14} /> Analytics & Trends
        </button>
      </div>

      {activeReportTab === 'SUMMARY' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-spring-bounce">
          
          {/* COLUMN 1 & 2 (SCORE & AI STATS) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* SCORE HERO CARD */}
            <Card variant="glass" className="relative p-8 border-mint-wellness/20 bg-gradient-to-br from-mint-wellness/5 to-transparent dark:from-mint-wellness/10 flex flex-col sm:flex-row items-center gap-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-mint-wellness/5 rounded-full blur-3xl -z-10" />
              
              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center rounded-full border-4 border-mint-wellness shadow-sm">
                <span className="text-3xl font-extrabold text-deep-charcoal dark:text-frosted-pearl font-display">
                  {report.healthScore}%
                </span>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-deep-charcoal font-display dark:text-frosted-pearl flex items-center justify-center sm:justify-start gap-2">
                  <Trophy className="text-amber-500" size={20} />
                  <span>{activePet?.name || 'Max'} is Blooming!</span>
                </h3>
                <p className="text-sm text-warm-slate mt-2 dark:text-frosted-pearl/75 leading-relaxed">
                  Excellent lifestyle adherence this week. Digestive logs and physical telemetry represent normal ranges. Keep it up!
                </p>
              </div>
            </Card>

            {/* AI HEALTH REFLECTIONS */}
            <Card variant="default">
              <h3 className="text-base font-bold text-deep-charcoal font-display mb-3 dark:text-frosted-pearl flex items-center gap-2">
                <Sparkles className="text-bloom-rose" size={18} />
                <span>AI Health Summary</span>
              </h3>
              <div className="text-sm text-deep-charcoal dark:text-frosted-pearl leading-relaxed bg-warm-cream/30 p-4 rounded-xl dark:bg-white/5 border border-deep-charcoal/5 dark:border-white/5">
                {report.summary}
              </div>
            </Card>

            {/* AI-GENERATED RECOMMENDATIONS HIGHLIGHTS */}
            <div>
              <h3 className="text-sm font-bold font-display text-warm-slate uppercase tracking-wider mb-3 dark:text-frosted-pearl/80">
                AI Recommendations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aiRecommendations.map((rec, idx) => (
                  <Card key={idx} variant="default" className="flex items-start gap-3 p-4">
                    <div className="mt-0.5">
                      {rec.status === 'CRITICAL' && <Badge variant="warning">High</Badge>}
                      {rec.status === 'WARNING' && <Badge variant="warning">Alert</Badge>}
                      {rec.status === 'INFO' && <Badge variant="info">Walk</Badge>}
                      {rec.status === 'SUCCESS' && <Badge variant="success">Food</Badge>}
                    </div>
                    <span className="text-xs text-deep-charcoal dark:text-frosted-pearl leading-relaxed">
                      {rec.text}
                    </span>
                  </Card>
                ))}
              </div>
            </div>

          </div>

          {/* COLUMN 3: HIGHLIGHTS & COMPARISONS */}
          <div className="flex flex-col gap-6">
            
            {/* WELLNESS ADHERENCE CHECKS */}
            <Card variant="default">
              <h3 className="text-base font-bold text-deep-charcoal font-display mb-4 dark:text-frosted-pearl">
                Wellness Compliance
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-warm-slate dark:text-frosted-pearl/80 mb-1">
                    <span>Nutrition consistency</span>
                    <span>{report.insights.nutritionTargetMet}%</span>
                  </div>
                  <ProgressBar value={report.insights.nutritionTargetMet} color="primary" height="sm" />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-semibold text-warm-slate dark:text-frosted-pearl/80 mb-1">
                    <span>Hydration Levels</span>
                    <span>{report.insights.hydrationTargetMet}%</span>
                  </div>
                  <ProgressBar value={report.insights.hydrationTargetMet} color="secondary" height="sm" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-warm-slate dark:text-frosted-pearl/80 mb-1">
                    <span>Walk Durations</span>
                    <span>{report.insights.exerciseMinutes > 200 ? 100 : Math.round((report.insights.exerciseMinutes / 200) * 100)}%</span>
                  </div>
                  <ProgressBar value={report.insights.exerciseMinutes > 200 ? 100 : Math.round((report.insights.exerciseMinutes / 200) * 100)} color="primary" height="sm" />
                </div>
              </div>
            </Card>

            {/* ADHERENCE CALENDAR HEATMAP */}
            <Card variant="default">
              <h3 className="text-base font-bold text-deep-charcoal font-display mb-3 dark:text-frosted-pearl flex items-center gap-2">
                <Calendar size={18} className="text-warm-slate" />
                <span>Habit Heatmap</span>
              </h3>
              <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mb-3">
                Daily timeline checklist completions (last 14 days)
              </p>
              
              <div className="grid grid-cols-7 gap-2">
                {heatmapDays.map((day, idx) => {
                  let opacityColor = 'bg-emerald-500/10 dark:bg-emerald-950/20';
                  if (day.val === 3) opacityColor = 'bg-emerald-500/40 text-white';
                  if (day.val === 4) opacityColor = 'bg-emerald-500/70 text-white';
                  if (day.val === 5) opacityColor = 'bg-emerald-500 text-white';
                  return (
                    <div
                      key={idx}
                      className={`h-8 rounded-lg flex flex-col items-center justify-center text-xxs font-semibold border border-deep-charcoal/5 dark:border-white/5 select-none ${opacityColor}`}
                      title={`${day.date}: ${day.val} tasks done`}
                    >
                      {day.date}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* ACHIEVEMENTS */}
            <Card variant="default">
              <h3 className="text-base font-bold text-deep-charcoal font-display mb-3 dark:text-frosted-pearl flex items-center gap-2">
                <Award size={18} className="text-bloom-rose" />
                <span>Weekly Achievements</span>
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-warm-slate dark:text-frosted-pearl/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-bloom-rose" />
                  <span>Hydration goals consecutive 3 days</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-warm-slate dark:text-frosted-pearl/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-bloom-rose" />
                  <span>Walk targets met 6 out of 7 days</span>
                </div>
              </div>
            </Card>

            {/* ATTENTION AREAS */}
            <Card variant="default">
              <h3 className="text-base font-bold text-deep-charcoal font-display mb-3 dark:text-frosted-pearl flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <span>Areas Needing Attention</span>
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-warm-slate dark:text-frosted-pearl/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Hydration low on Wednesday (700ml)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-warm-slate dark:text-frosted-pearl/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Grooming routine is due tomorrow</span>
                </div>
              </div>
            </Card>

          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-spring-bounce">
          
          {/* WATER INTAKE TREND (CSS BAR CHART) */}
          <Card variant="default">
            <h3 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4">
              Water Intake Trend (ml)
            </h3>
            <div className="h-40 flex items-end gap-3 justify-between px-2 pt-6">
              {[
                { label: 'M', val: 800, ht: 'h-[80%]' },
                { label: 'T', val: 950, ht: 'h-[95%]' },
                { label: 'W', val: 700, ht: 'h-[70%]' },
                { label: 'T', val: 1100, ht: 'h-[100%]' },
                { label: 'F', val: 850, ht: 'h-[85%]' },
                { label: 'S', val: 900, ht: 'h-[90%]' },
                { label: 'S', val: 1000, ht: 'h-[100%]' },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`w-full ${bar.ht} bg-blue-500/80 rounded-t-md hover:bg-blue-500 transition-colors relative group cursor-pointer`}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xxs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.val}
                    </span>
                  </div>
                  <span className="text-xxs font-semibold text-warm-slate">{bar.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* EXERCISE TREND (CSS BAR CHART) */}
          <Card variant="default">
            <h3 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4">
              Exercise Active Time (mins)
            </h3>
            <div className="h-40 flex items-end gap-3 justify-between px-2 pt-6">
              {[
                { label: 'M', val: 30, ht: 'h-[60%]' },
                { label: 'T', val: 45, ht: 'h-[90%]' },
                { label: 'W', val: 50, ht: 'h-[100%]' },
                { label: 'T', val: 20, ht: 'h-[40%]' },
                { label: 'F', val: 35, ht: 'h-[70%]' },
                { label: 'S', val: 60, ht: 'h-[100%]' },
                { label: 'S', val: 45, ht: 'h-[90%]' },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`w-full ${bar.ht} bg-emerald-500/80 rounded-t-md hover:bg-emerald-500 transition-colors relative group cursor-pointer`}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xxs font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.val}m
                    </span>
                  </div>
                  <span className="text-xxs font-semibold text-warm-slate">{bar.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* WEIGHT DEVELOPMENT CURVE (SVG LINE CHART) */}
          <Card variant="default">
            <h3 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4">
              Weight Development Curve (kg)
            </h3>
            <div className="relative h-40 pt-4 flex flex-col justify-between">
              {/* SVG Line Graph */}
              <svg className="w-full h-28" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB7185" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#FB7185" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path d="M10,80 Q75,50 150,45 T290,30 L290,100 L10,100 Z" fill="url(#curveGrad)" />
                {/* Weight Curve Line */}
                <path
                  d="M10,80 Q75,50 150,45 T290,30"
                  fill="none"
                  stroke="#FB7185"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Grid guidelines */}
                <line x1="0" y1="80" x2="300" y2="80" stroke="#888" strokeWidth="0.5" strokeDasharray="3" opacity="0.3" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#888" strokeWidth="0.5" strokeDasharray="3" opacity="0.3" />
                <line x1="0" y1="30" x2="300" y2="30" stroke="#888" strokeWidth="0.5" strokeDasharray="3" opacity="0.3" />
                
                {/* Dots on coordinate markers */}
                <circle cx="10" cy="80" r="4" fill="#FB7185" />
                <circle cx="150" cy="45" r="4" fill="#FB7185" />
                <circle cx="290" cy="30" r="4" fill="#FB7185" />
              </svg>
              
              <div className="flex justify-between text-xxs font-semibold text-warm-slate px-2">
                <span>Month 1: 14.1 kg</span>
                <span>Month 3: 14.5 kg</span>
                <span>Month 6 (Current): 14.8 kg</span>
              </div>
            </div>
          </Card>

          {/* VACCINATION & HEALTH EVENT TIMELINE */}
          <Card variant="default">
            <h3 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4">
              Health Timeline
            </h3>
            <div className="flex flex-col gap-4 border-l border-deep-charcoal/5 pl-4 ml-2 dark:border-white/5 py-1">
              <div className="relative">
                <span className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-midnight-forest" />
                <span className="text-xs font-semibold text-deep-charcoal dark:text-frosted-pearl">DHPP Booster Vaccine</span>
                <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">Administered: June 20, 2026</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-midnight-forest" />
                <span className="text-xs font-semibold text-deep-charcoal dark:text-frosted-pearl">Ear scratching symptom flagged</span>
                <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">Observed: June 15, 2026 (resolved)</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border border-white dark:border-midnight-forest" />
                <span className="text-xs font-semibold text-deep-charcoal dark:text-frosted-pearl">Standard clinical checkup</span>
                <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">Completed: May 12, 2026</p>
              </div>
            </div>
          </Card>

        </div>
      )}

    </PageWrapper>
  );
};
export default ReportsPage;
