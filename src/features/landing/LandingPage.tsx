import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Chips } from '@/components/ui/Chips';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import {
  Sparkles,
  Activity,
  Apple,
  Bath,
  Stethoscope,
  MapPin,
  ChevronDown,
  ShieldAlert,
  ArrowRight,
  Sun,
  Moon,
  Check,
  CheckCircle2,
  TrendingUp,
  Calendar,
  HelpCircle
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const LandingPage: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  
  // State for Accordion FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // State for AI Chat Showcase
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Hi Sarah! I am Max's care concierge. How can I help you care for him today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const runShowcaseChat = async (text: string) => {
    if (isTyping) return;
    
    // Add user message
    const newMessages = [...chatMessages, { role: 'user' as const, content: text }];
    setChatMessages(newMessages);
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    let reply = `I've updated that for Max. I'll make sure to watch for any changes in his logs. Is there anything else you want to note?`;
    if (text.includes('scratching')) {
      reply = `I see Max is scratching his left ear. Since he is a Golden Retriever (6 months old) and takes Apoquel daily for seasonal allergies, dry summer grass could be triggering this. I've logged a symptom note and added 'Clean Max's ears' to your evening grooming schedule.`;
    } else if (text.includes('meal')) {
      reply = `I've planned Max's daily feeding schedule: 220g of Royal Canin Puppy Large at 08:00 AM (completed) and 06:00 PM. Based on local weather (74°F), I recommend avoiding walks between 11 AM and 4 PM.`;
    } else if (text.includes('stool')) {
      reply = `Stool parameters logged. Stool consistency was marked as 'soft'. I will cross-reference this with his meal history. If this occurs on his next potty breaks, I will notify you with dietary adjustments.`;
    }

    setChatMessages([...newMessages, { role: 'assistant' as const, content: reply }]);
    setIsTyping(false);
  };

  const chatSuggestions = [
    'Max is scratching his left ear',
    'Generate a hot-weather walk schedule',
    'Log soft stool parameters'
  ];

  const faqItems: FaqItem[] = [
    {
      question: 'Is PetBloom a replacement for veterinary care?',
      answer: 'No. PetBloom is a wellness and care coordinator. While it analyzes trends and symptoms to help flag concerns, it does not provide clinical veterinary diagnostics. It automatically highlights emergency markers and advises you when a vet clinic visit is recommended.',
    },
    {
      question: 'How does the AI remember and learn about my pet?',
      answer: 'PetBloom uses a structured memory architecture. Daily metrics (like water, food, symptoms) are saved in a time-series log. The AI agent reflectively summarizes these logs into long-term behavioral preferences and condition alerts, referencing them in chat sessions.',
    },
    {
      question: 'What is the Weekly Bloom Score?',
      answer: 'The Weekly Bloom Score is an index calculated out of 100 that scores habit adherence (feeding completed, walk quotas, medication doses taken). It helps pet parents visually track care consistency without game-like complexity.',
    },
    {
      question: 'Can I manage multiple pets?',
      answer: 'Absolutely. PetBloom supports multi-pet households. You can toggle between pet profiles, and the AI agent automatically swaps contexts, breed parameters, and historical memory sets.',
    },
  ];

  const roadmapItems = [
    { phase: 'Phase 1', title: 'Core Agent Setup', desc: 'Onboarding flows, logging tools, custom timelines, and proactive AI notifications.', completed: true },
    { phase: 'Phase 2', title: 'Multimodal Image Analysis', desc: 'Allow users to upload pictures of stools, skin rashes, or food labels for immediate AI evaluations.', completed: false },
    { phase: 'Phase 3', title: 'IoT Hardware Integrations', desc: 'Connect smart collars (steps/sleep) and automated feeders to synchronize logs without manual entry.', completed: false },
    { phase: 'Phase 4', title: 'Veterinary CRM Portals', desc: 'Generate one-click veterinary summaries to export Max\'s medical profiles directly to your local vet.', completed: false },
  ];

  return (
    <div className="min-h-screen bg-warm-cream dark:bg-midnight-forest text-deep-charcoal dark:text-frosted-pearl transition-colors duration-300">
      
      {/* 1. RESPONSIVE NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-pure-linen/80 dark:bg-slate-velvet/80 backdrop-blur-md border-b border-deep-charcoal/5 dark:border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-bloom-rose flex items-center justify-center text-white font-bold text-lg font-display">
              P
            </div>
            <div>
              <span className="font-display font-bold text-lg leading-tight">PetBloom</span>
              <span className="hidden sm:inline-block ml-2 text-xxs text-warm-slate px-1.5 py-0.5 bg-bloom-rose/10 text-bloom-rose rounded-full font-semibold">
                MVP Showcase
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-warm-slate dark:text-frosted-pearl/80">
            <a href="#features" className="hover:text-bloom-rose transition-colors">Features</a>
            <a href="#ai-works" className="hover:text-bloom-rose transition-colors">How it Works</a>
            <a href="#concierge" className="hover:text-bloom-rose transition-colors">AI Concierge</a>
            <a href="#faq" className="hover:text-bloom-rose transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-warm-slate/10 dark:hover:bg-white/10 text-warm-slate dark:text-frosted-pearl transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>

            <Link to="/login">
              <Button variant="primary" size="sm" className="cursor-pointer">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-bloom-rose/10 via-transparent to-transparent -z-10 blur-3xl opacity-50" />
        
        <Badge variant="info" className="mb-6 font-semibold animate-spring-bounce">
          🌸 Helping Every Pet Bloom
        </Badge>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-tight text-deep-charcoal dark:text-frosted-pearl">
          The AI-powered Concierge for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-bloom-rose to-peach-500">
            Your Pet's Wellness Journey
          </span>
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-warm-slate dark:text-frosted-pearl/70 max-w-2xl mx-auto leading-relaxed">
          Manage nutrition, medical records, stool trends, and travel schedules in a single, beautiful dashboard supported by an active, learning AI companion.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto cursor-pointer shadow-md">
              Start Free Trial <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto cursor-pointer">
              View Demo Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. PRODUCT PREVIEW / INTERACTIVE DASHBOARD MOCKUP */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-28">
        <Card variant="glass" className="shadow-2xl overflow-hidden p-0 border-deep-charcoal/5 dark:border-white/5">
          {/* Header Bar */}
          <div className="bg-pure-linen dark:bg-slate-velvet/50 px-6 py-4 flex items-center justify-between border-b border-deep-charcoal/5 dark:border-white/5">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-warm-slate ml-2 dark:text-frosted-pearl/60 select-none">
                dashboard.petbloom.com
              </span>
            </div>
            <Badge variant="success">Max 🐶</Badge>
          </div>

          {/* Miniature Interactive Mock Grid */}
          <div className="bg-warm-cream/30 dark:bg-slate-velvet/20 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Mock Col - Timelines */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <Card variant="default" className="p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold font-display flex items-center gap-2">
                    <Calendar size={16} className="text-bloom-rose" />
                    <span>Max's Routine Checklist</span>
                  </h4>
                  <span className="text-xxs text-warm-slate dark:text-frosted-pearl/60">Today</span>
                </div>
                <div className="flex flex-col gap-3.5 pl-3 border-l border-bloom-rose/20">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-warm-slate line-through opacity-60">Morning Meal (220g Royal Canin)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-warm-slate line-through opacity-60">Apoquel Daily tablet (16mg)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded-full border-2 border-bloom-rose/40 animate-pulse flex-shrink-0" />
                    <span className="font-semibold">Afternoon Walk (30 mins)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs opacity-60">
                    <div className="w-4 h-4 rounded-full border-2 border-warm-slate/30 flex-shrink-0" />
                    <span>Teeth & Coat Brush</span>
                  </div>
                </div>
              </Card>

              {/* Mock AI Insight box */}
              <Card variant="glass" className="p-5 border-bloom-rose/20 bg-gradient-to-r from-bloom-rose/5 to-transparent dark:from-bloom-rose/10">
                <div className="flex gap-3 items-start">
                  <Sparkles className="text-bloom-rose mt-0.5" size={18} />
                  <div>
                    <h5 className="text-xs font-bold font-display text-deep-charcoal dark:text-frosted-pearl">
                      AI Active Suggestion
                    </h5>
                    <p className="text-xs text-warm-slate mt-1 dark:text-frosted-pearl/70 leading-relaxed">
                      "Max drank 25% less water today than his usual Monday average. Consider refilling his bowl with cool filtered water to stimulate hydration."
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Mock Col - Analytics */}
            <div className="flex flex-col gap-6">
              <Card variant="default" className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold font-display">Weekly Health</h4>
                  <TrendingUp size={16} className="text-mint-wellness" />
                </div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-warm-slate">Bloom Adherence</span>
                  <span className="font-semibold text-mint-wellness">92%</span>
                </div>
                <ProgressBar value={92} color="secondary" height="sm" />
                
                <div className="mt-5 border-t border-deep-charcoal/5 pt-4 dark:border-white/5 flex flex-col gap-2">
                  <div className="flex justify-between text-xxs">
                    <span className="text-warm-slate">Weight Trend</span>
                    <span className="font-semibold">14.8 kg (+0.4)</span>
                  </div>
                  <div className="flex justify-between text-xxs">
                    <span className="text-warm-slate">Hydration Metric</span>
                    <span className="font-semibold text-amber-500">Unstable (Low)</span>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        </Card>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-deep-charcoal/5 dark:border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="info">Complete Care Modules</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mt-4 text-deep-charcoal dark:text-frosted-pearl">
            Everything Your Pet Needs to Bloom
          </h2>
          <p className="mt-4 text-warm-slate dark:text-frosted-pearl/70">
            Ditch the multiple trackers. PetBloom unifies all aspects of pet wellness under a single smart AI core.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card variant="default" hoverEffect className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-pastel-nutrition/20 flex items-center justify-center text-orange-500">
              <Apple size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">Nutrition & Water Tracker</h3>
              <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65 leading-relaxed">
                Log meals and water bowls. Our prediction engine estimates daily food consumption and prompts you when inventory is running low.
              </p>
            </div>
          </Card>

          {/* Feature 2 */}
          <Card variant="default" hoverEffect className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Stethoscope size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">Digestive Health & Stool Monitor</h3>
              <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65 leading-relaxed">
                Track stool frequency, consistency, and color. The AI analyzes anomalies (such as liquid stools) to alert you of possible gut concerns.
              </p>
            </div>
          </Card>

          {/* Feature 3 */}
          <Card variant="default" hoverEffect className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-pastel-hygiene/20 flex items-center justify-center text-purple-500">
              <Bath size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">Grooming & Hygiene</h3>
              <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65 leading-relaxed">
                Stay on top of baths, coat brushing, claw trims, and ear cleaning with dynamically generated alerts based on breed and season.
              </p>
            </div>
          </Card>

          {/* Feature 4 */}
          <Card variant="default" hoverEffect className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-pastel-exercise/20 flex items-center justify-center text-emerald-600">
              <Activity size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">Exercise Tracker</h3>
              <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65 leading-relaxed">
                Log walks, active running, and playtime. Ingests local weather telemetry to advise you against walks during asphalt-melting heat.
              </p>
            </div>
          </Card>

          {/* Feature 5 */}
          <Card variant="default" hoverEffect className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <MapPin size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">Travel Planner</h3>
              <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65 leading-relaxed">
                Generate packing lists, prepare schedules for pet sitters, and keep your pet's vaccination cards readily accessible during trips.
              </p>
            </div>
          </Card>

          {/* Feature 6 */}
          <Card variant="default" hoverEffect className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">Emergency Preparedness</h3>
              <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65 leading-relaxed">
                Quick-access first-aid manuals, toxic substance checkers, and single-tap vet locator services to keep you prepared for sudden incidents.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. AI AGENT LIFECYCLE: HOW PETBLOOM WORKS */}
      <section id="ai-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-deep-charcoal/5 dark:border-white/5 bg-warm-cream/20 dark:bg-slate-velvet/10 rounded-3xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="info">The Agent Cycle</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mt-4 text-deep-charcoal dark:text-frosted-pearl">
            Inside the AI Pet Concierge Lifecycle
          </h2>
          <p className="mt-4 text-warm-slate dark:text-frosted-pearl/70">
            Unlike static trackers, PetBloom operates on a continuous loop of active care.
          </p>
        </div>

        {/* Steps Loop Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="flex gap-4 items-start relative">
            <div className="w-10 h-10 rounded-full bg-bloom-rose text-white flex items-center justify-center font-bold font-display flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-sm font-display text-deep-charcoal dark:text-frosted-pearl">Observe</h4>
              <p className="text-xs text-warm-slate mt-1.5 dark:text-frosted-pearl/65 leading-relaxed">
                Reads the logs you post (meals, water intake, symptoms, behavior) and references external metrics like local temperature.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-bloom-rose text-white flex items-center justify-center font-bold font-display flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-sm font-display text-deep-charcoal dark:text-frosted-pearl">Remember</h4>
              <p className="text-xs text-warm-slate mt-1.5 dark:text-frosted-pearl/65 leading-relaxed">
                Maintains long-term profiles and builds a semantic memory map of preferences, medical constraints, and recurring trends.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-bloom-rose text-white flex items-center justify-center font-bold font-display flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-sm font-display text-deep-charcoal dark:text-frosted-pearl">Reason</h4>
              <p className="text-xs text-warm-slate mt-1.5 dark:text-frosted-pearl/65 leading-relaxed">
                Cross-references metrics against veterinary benchmarks to spot anomalies (e.g. tracking scratch intervals vs. allergy files).
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-bloom-rose text-white flex items-center justify-center font-bold font-display flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-sm font-display text-deep-charcoal dark:text-frosted-pearl">Plan</h4>
              <p className="text-xs text-warm-slate mt-1.5 dark:text-frosted-pearl/65 leading-relaxed">
                Generates a customized daily agenda, scheduling feeding windows, walks, and medications relative to temperature shifts.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-bloom-rose text-white flex items-center justify-center font-bold font-display flex-shrink-0">
              5
            </div>
            <div>
              <h4 className="font-bold text-sm font-display text-deep-charcoal dark:text-frosted-pearl">Act</h4>
              <p className="text-xs text-warm-slate mt-1.5 dark:text-frosted-pearl/65 leading-relaxed">
                Sends proactive alerts and outputs conversational guidelines, assisting you before logs become emergency cases.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-bloom-rose text-white flex items-center justify-center font-bold font-display flex-shrink-0">
              6
            </div>
            <div>
              <h4 className="font-bold text-sm font-display text-deep-charcoal dark:text-frosted-pearl">Reflect</h4>
              <p className="text-xs text-warm-slate mt-1.5 dark:text-frosted-pearl/65 leading-relaxed">
                Calculates the Weekly Bloom Score, summarizes diet & habit progress, and adapts future daily care plans accordingly.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. AI CONCIERGE SHOWCASE (INTERACTIVE CONVERSATION PREVIEW) */}
      <section id="concierge" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-deep-charcoal/5 dark:border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="info">Proactive Conversational Partner</Badge>
          <h2 className="text-3xl font-display font-bold mt-3 text-deep-charcoal dark:text-frosted-pearl">
            Interact with the Pet Concierge
          </h2>
          <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/60">
            Select a care inquiry below to watch the AI concierge retrieve context and formulate active recommendations.
          </p>
        </div>

        <div className="flex flex-col gap-6 border border-deep-charcoal/5 rounded-2xl p-5 bg-pure-linen dark:bg-slate-velvet dark:border-white/5 shadow-md">
          {/* Chat Panel Box */}
          <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto min-h-[220px] justify-end">
            {chatMessages.map((msg, idx) => {
              const isAi = msg.role === 'assistant';
              return (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start' : 'self-end flex-row-reverse'}`}>
                  <Avatar
                    src={isAi ? undefined : 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah'}
                    name={isAi ? 'AI' : 'Sarah'}
                    size="sm"
                    className={isAi ? 'bg-bloom-rose/10 text-bloom-rose font-bold' : ''}
                  />
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${isAi ? 'bg-warm-cream dark:bg-white/5 dark:text-frosted-pearl rounded-tl-xs' : 'bg-bloom-rose text-white rounded-tr-xs'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] self-start animate-pulse">
                <Avatar name="AI" size="sm" className="bg-bloom-rose/10 text-bloom-rose" />
                <div className="bg-warm-cream p-3 rounded-2xl rounded-tl-xs text-xs text-warm-slate flex items-center gap-1.5 dark:bg-white/5 dark:text-frosted-pearl/60">
                  <Sparkles size={14} className="animate-spin text-bloom-rose" />
                  <span>Concierge is drafting...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chips suggestions */}
          <div className="flex flex-wrap gap-2 border-t border-deep-charcoal/5 dark:border-white/5 pt-4">
            {chatSuggestions.map((sug) => (
              <Chips
                key={sug}
                label={sug}
                onClick={() => runShowcaseChat(sug)}
                className="cursor-pointer text-xs"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY PETBLOOM SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-deep-charcoal/5 dark:border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="info">Why PetBloom</Badge>
          <h2 className="text-3xl font-display font-bold mt-3 text-deep-charcoal dark:text-frosted-pearl">
            Built for Proactive Care
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="p-3 bg-bloom-rose/10 text-bloom-rose rounded-full flex-shrink-0 h-11 w-11 flex items-center justify-center font-bold">
              <Check size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm font-display text-deep-charcoal dark:text-frosted-pearl">Breed-Specific Intelligence</h4>
              <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65 leading-relaxed">
                Golden Retrievers grow differently than Ragdoll Cats. The AI agent references standardized veterinary guidelines for weight, nutritional intake, and activity benchmarks tailored directly to your pet's breed and age stage.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-bloom-rose/10 text-bloom-rose rounded-full flex-shrink-0 h-11 w-11 flex items-center justify-center font-bold">
              <Check size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm font-display text-deep-charcoal dark:text-frosted-pearl">Environmental Adaptations</h4>
              <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65 leading-relaxed">
                The agent monitors local weather status and automatically adjusts timelines. Walks are rescheduled on hot days, and hydration targets scale up under summer heat.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-bloom-rose/10 text-bloom-rose rounded-full flex-shrink-0 h-11 w-11 flex items-center justify-center font-bold">
              <Check size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm font-display text-deep-charcoal dark:text-frosted-pearl">Dynamic Memory Loop</h4>
              <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65 leading-relaxed">
                No copy-pasting. The AI references logs recorded over weeks to connect symptoms to conditions (e.g. ear scratching and allergy tables).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-bloom-rose/10 text-bloom-rose rounded-full flex-shrink-0 h-11 w-11 flex items-center justify-center font-bold">
              <Check size={18} />
            </div>
            <div>
              <h4 className="font-bold text-sm font-display text-deep-charcoal dark:text-frosted-pearl">Safety Guardrails</h4>
              <p className="text-xs text-warm-slate mt-2 dark:text-frosted-pearl/65 leading-relaxed">
                Built-in toxic substance catalogs, immediate first-aid checklist screens, and single-click veterinary clinic call shortcuts keep you prepared for emergency scenarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS (MOCK DATA) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-deep-charcoal/5 dark:border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="info">User & Vet Endorsements</Badge>
          <h2 className="text-3xl font-display font-bold mt-3 text-deep-charcoal dark:text-frosted-pearl">
            Trusted by Owners and Professionals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card variant="default" className="flex flex-col justify-between">
            <p className="text-xs text-warm-slate leading-relaxed italic dark:text-frosted-pearl/70">
              "As a first-time puppy owner, I was constantly anxious about food ratios and stool consistencies. PetBloom's daily checklist and warm, direct advice made Max's onboarding extremely clean."
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Avatar name="Sarah Jenkins" size="sm" src="https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah" />
              <div>
                <h5 className="text-xs font-bold font-display text-deep-charcoal dark:text-frosted-pearl">Sarah Jenkins</h5>
                <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60">Owner of Max (Golden Retriever)</p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="flex flex-col justify-between">
            <p className="text-xs text-warm-slate leading-relaxed italic dark:text-frosted-pearl/70">
              "PetBloom represents the future of home pet care. It encourages consistent logging that helps pet owners catch anomalies (like persistent ear scratching) before they turn into critical medical cases."
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Avatar name="Dr Martinez" size="sm" src="https://api.dicebear.com/7.x/adventurer/svg?seed=Vet" />
              <div>
                <h5 className="text-xs font-bold font-display text-deep-charcoal dark:text-frosted-pearl">Dr. Julia Martinez, DVM</h5>
                <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60">Green Valley Animal Hospital</p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="flex flex-col justify-between">
            <p className="text-xs text-warm-slate leading-relaxed italic dark:text-frosted-pearl/70">
              "The weather-adaptive planning is amazing. In Texas, summer heat index is a major risk for dog paws. PetBloom automatically adjusts my walking slots to early morning and evening hours."
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Avatar name="David Lee" size="sm" src="https://api.dicebear.com/7.x/adventurer/svg?seed=David" />
              <div>
                <h5 className="text-xs font-bold font-display text-deep-charcoal dark:text-frosted-pearl">David Lee</h5>
                <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60">Owner of Cooper (Labrador)</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 9. FUTURE ROADMAP */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-deep-charcoal/5 dark:border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="info">Phased Expansion</Badge>
          <h2 className="text-3xl font-display font-bold mt-3 text-deep-charcoal dark:text-frosted-pearl">
            Product Development Roadmap
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {roadmapItems.map((item, idx) => (
            <Card key={idx} variant="default" className={`flex gap-4 p-5 items-start ${item.completed ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-warm-slate/30'}`}>
              <div className="flex-shrink-0 mt-0.5">
                <Badge variant={item.completed ? 'success' : 'neutral'}>
                  {item.completed ? 'Active MVP' : item.phase}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl">{item.title}</h4>
                <p className="text-xs text-warm-slate mt-1 dark:text-frosted-pearl/70 leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 10. FAQ SECTION (COLLAPSIBLE ACCORDION) */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-deep-charcoal/5 dark:border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="info">FAQ</Badge>
          <h2 className="text-3xl font-display font-bold mt-3 text-deep-charcoal dark:text-frosted-pearl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <Card
                key={idx}
                variant="default"
                className="p-4 cursor-pointer select-none transition-all dark:border-white/5"
                onClick={() => handleFaqToggle(idx)}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-deep-charcoal dark:text-frosted-pearl flex items-center gap-2">
                    <HelpCircle size={16} className="text-bloom-rose flex-shrink-0" />
                    <span>{item.question}</span>
                  </h4>
                  <ChevronDown
                    size={16}
                    className={`text-warm-slate transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                {isOpen && (
                  <p className="mt-3 text-xs text-warm-slate leading-relaxed border-t border-deep-charcoal/5 pt-3 dark:border-white/5 dark:text-frosted-pearl/70 animate-fade-in">
                    {item.answer}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* 11. CALL TO ACTION SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
        <Card variant="glass" className="relative p-10 text-center border-bloom-rose/30 bg-gradient-to-br from-bloom-rose/10 via-transparent to-transparent dark:from-bloom-rose/15 overflow-hidden">
          <h2 className="text-3xl font-display font-extrabold text-deep-charcoal dark:text-frosted-pearl">
            Ready to Help Your Pet Bloom?
          </h2>
          <p className="mt-4 text-sm text-warm-slate max-w-lg mx-auto dark:text-frosted-pearl/70">
            Sign up for the MVP trial today and begin structuring schedules, checking digest reports, and talking with your AI care concierge.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/login">
              <Button variant="primary" size="lg" className="cursor-pointer shadow-md">
                Get Started Free
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* 12. FOOTER */}
      <footer className="border-t border-deep-charcoal/5 dark:border-white/5 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-warm-slate dark:text-frosted-pearl/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-bloom-rose flex items-center justify-center text-white font-bold text-xs font-display">
              P
            </div>
            <span className="font-display font-semibold text-deep-charcoal dark:text-frosted-pearl">
              PetBloom
            </span>
          </div>

          <div className="flex gap-6">
            <a href="#features" className="hover:text-bloom-rose transition-colors">Features</a>
            <a href="#ai-works" className="hover:text-bloom-rose transition-colors">How it Works</a>
            <a href="#concierge" className="hover:text-bloom-rose transition-colors">AI Concierge</a>
          </div>

          <p>© 2026 PetBloom Inc. All rights reserved. Helping Every Pet Bloom.</p>
        </div>
      </footer>

    </div>
  );
};
export default LandingPage;
