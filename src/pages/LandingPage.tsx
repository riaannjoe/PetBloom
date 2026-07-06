import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { env } from '@/config/env';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-cream dark:bg-midnight-forest">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🌸
          </span>
          <span className="font-display text-xl font-semibold text-bloom-rose">
            {env.appName}
          </span>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-warm-slate md:flex">
          <a href="#features" className="hover:text-bloom-rose">
            Features
          </a>
          <a href="#reviews" className="hover:text-bloom-rose">
            Reviews
          </a>
        </nav>
        <Link to="/app/dashboard">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-deep-charcoal md:text-5xl dark:text-frosted-pearl">
          Helping Every Pet Bloom
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-slate dark:text-frosted-pearl/70">
          The AI-powered concierge for your pet&apos;s life — nutrition, health,
          hygiene, and personalized care guidance in one warm, trusted place.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/app/dashboard">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <Button variant="ghost" size="lg">
            Watch Demo
          </Button>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3"
      >
        {[
          {
            title: 'Proactive Care',
            body: 'AI auto-schedules walks and meal prep based on your pet\'s profile.',
          },
          {
            title: 'Symptom Alerts',
            body: 'Checks stool consistency and alerts for anomalies before they escalate.',
          },
          {
            title: 'Weekly Bloom Digests',
            body: 'Structured health scores and developmental trend summaries.',
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-warm-slate/10 bg-pure-linen p-6 dark:border-white/5 dark:bg-slate-velvet"
          >
            <h3 className="font-display text-lg font-medium text-deep-charcoal dark:text-frosted-pearl">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-warm-slate dark:text-frosted-pearl/70">
              {feature.body}
            </p>
          </div>
        ))}
      </section>

      <footer
        id="reviews"
        className="border-t border-warm-slate/10 px-6 py-8 text-center text-sm text-warm-slate dark:border-white/5"
      >
        <p>PetBloom — Your pet&apos;s wellness concierge.</p>
      </footer>
    </div>
  );
}
