import React, { useState, useRef, useEffect } from 'react';
import { usePetStore } from '@/store/petStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useMemoryStore } from '@/store/memoryStore';
import { PageWrapper } from '@/layouts/PageWrapper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Chips } from '@/components/ui/Chips';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Calendar,
  Utensils,
  Footprints,
  Bath,
  Brain,
  Trophy
} from 'lucide-react';

export const ChatPage: React.FC = () => {
  const addToast = useNotificationStore((s) => s.addToast);
  const {
    chatHistory,
    addChatMessage,
    clearChatHistory,
    pets,
    activePetId,
    reminders
  } = usePetStore();

  const { timelineLogs } = useMemoryStore();

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];
  const activeMemoryLogs = timelineLogs.filter((m) => m.petId === activePetId);
  const activeReminders = reminders.filter((r) => r.petId === activePetId && r.status === 'PENDING');

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, sending, streamingText]);

  // Handle message response streaming simulator
  useEffect(() => {
    if (chatHistory.length > 0) {
      const lastMsg = chatHistory[chatHistory.length - 1];
      
      // Register stream message ID to prevent typewriter trigger later
      if (lastMsg.role === 'assistant' && lastMsg.isStreaming && streamingMessageId !== lastMsg.id) {
        setStreamingMessageId(lastMsg.id);
        return;
      }

      if (lastMsg.role === 'assistant' && !lastMsg.isStreaming && streamingMessageId !== lastMsg.id) {
        setStreamingMessageId(lastMsg.id);
        setStreamingText('');
        
        let index = 0;
        const words = lastMsg.content.split(' ');
        const interval = setInterval(() => {
          if (index < words.length) {
            setStreamingText((prev) => (prev ? prev + ' ' : '') + words[index]);
            index++;
          } else {
            clearInterval(interval);
            setStreamingMessageId(null);
            setStreamingText('');
          }
        }, 60); // Typewriter speed (60ms per word)
        
        return () => clearInterval(interval);
      }
    }
  }, [chatHistory, streamingMessageId]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || sending) return;

    setInput('');
    setSending(true);
    try {
      await addChatMessage(text);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'API Error',
        message: 'Could not fetch response from the concierge.'
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    addToast({
      type: 'success',
      title: 'Copied',
      message: 'Message copied to clipboard.'
    });
  };

  const handleRegenerate = async (lastUserText: string) => {
    if (sending) return;
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    await addChatMessage(lastUserText);
    setSending(false);
  };

  const suggestionChips = [
    `Show daily care plan for ${activePet?.name || 'Max'}`,
    'Show weekly bloom summary',
    'Show nutrition advice',
    'Show health warning check',
    'Show exercise suggestions',
    'Show grooming reminders'
  ];

  const followUps = [
    'How do I increase his hydration?',
    'What vaccinations are due next?',
    'Show my food stock logs'
  ];

  // Helper to check if text contains card keywords
  const getRichCard = (text: string) => {
    const lower = text.toLowerCase();
    
    if (lower.includes('daily care plan')) {
      return (
        <Card variant="glass" className="mt-4 border-l-4 border-l-bloom-rose">
          <h4 className="text-xs font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-3 flex items-center gap-1.5">
            <Sparkles size={14} className="text-bloom-rose" />
            <span>Daily Care Plan</span>
          </h4>
          <div className="flex flex-col gap-2.5 text-xxs leading-relaxed">
            <div className="flex justify-between border-b border-deep-charcoal/5 pb-1.5 dark:border-white/5">
              <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">08:00 AM</span>
              <span className="text-warm-slate dark:text-frosted-pearl/70">Breakfast Feed (220g Kibble)</span>
            </div>
            <div className="flex justify-between border-b border-deep-charcoal/5 pb-1.5 dark:border-white/5">
              <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">09:00 AM</span>
              <span className="text-warm-slate dark:text-frosted-pearl/70">Morning Walk (30 mins cardio)</span>
            </div>
            <div className="flex justify-between border-b border-deep-charcoal/5 pb-1.5 dark:border-white/5">
              <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">06:00 PM</span>
              <span className="text-warm-slate dark:text-frosted-pearl/70">Dinner Feed & Water Refill</span>
            </div>
          </div>
        </Card>
      );
    }
    
    if (lower.includes('weekly bloom summary')) {
      return (
        <Card variant="default" className="mt-4">
          <h4 className="text-xs font-bold font-display mb-3 flex items-center gap-1.5 text-emerald-600">
            <Trophy size={14} />
            <span>Weekly Bloom Score: 92%</span>
          </h4>
          <ProgressBar value={92} color="primary" height="sm" />
          <p className="text-xxs text-warm-slate dark:text-frosted-pearl/75 mt-3 leading-relaxed">
            Excellent hydration consistency. Exercise minutes exceeded standard breed targets by 10%.
          </p>
        </Card>
      );
    }

    if (lower.includes('nutrition advice')) {
      return (
        <Card variant="default" className="mt-4">
          <h4 className="text-xs font-bold font-display mb-3 flex items-center gap-1.5 text-orange-500">
            <Utensils size={14} />
            <span>Nutrition Metrics</span>
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xxs">
            <div className="p-2 bg-warm-cream/50 rounded-xl dark:bg-white/5">
              <span className="text-warm-slate dark:text-frosted-pearl/60">Target calories</span>
              <p className="font-bold text-deep-charcoal dark:text-frosted-pearl mt-0.5">1,240 kcal / day</p>
            </div>
            <div className="p-2 bg-warm-cream/50 rounded-xl dark:bg-white/5">
              <span className="text-warm-slate dark:text-frosted-pearl/60">Fiber content</span>
              <p className="font-bold text-deep-charcoal dark:text-frosted-pearl mt-0.5">4.5% standard breed</p>
            </div>
          </div>
        </Card>
      );
    }

    if (lower.includes('health warning')) {
      return (
        <Card variant="glass" className="mt-4 border-l-4 border-l-red-500 bg-red-500/5">
          <h4 className="text-xs font-bold font-display mb-2 text-red-500">Atopic Dermatitis Warning</h4>
          <p className="text-xxs text-warm-slate dark:text-frosted-pearl/85 leading-relaxed">
            Allergy flares may trigger scratching due to local humidity indexes (current forecast: high pollen). Apoquel dose checks recommended.
          </p>
        </Card>
      );
    }

    if (lower.includes('exercise suggestions')) {
      return (
        <Card variant="default" className="mt-4">
          <h4 className="text-xs font-bold font-display mb-3 flex items-center gap-1.5 text-emerald-600">
            <Footprints size={14} />
            <span>Breed Workout targets</span>
          </h4>
          <ProgressBar value={45} max={45} color="primary" height="sm" />
          <span className="text-xxs text-warm-slate dark:text-frosted-pearl/70 block mt-2">
            Target duration: 45 mins walk + 10 mins fetch training daily.
          </span>
        </Card>
      );
    }

    if (lower.includes('grooming reminders') || lower.includes('grooming suggestion')) {
      return (
        <Card variant="default" className="mt-4">
          <h4 className="text-xs font-bold font-display mb-3 flex items-center gap-1.5 text-purple-500">
            <Bath size={14} />
            <span>Grooming Schedule</span>
          </h4>
          <div className="flex flex-col gap-2 text-xxs">
            <div className="flex justify-between border-b border-deep-charcoal/5 pb-1 dark:border-white/5">
              <span>Nail Clipping</span>
              <span className="font-bold text-red-500">Overdue (3 weeks elapsed)</span>
            </div>
            <div className="flex justify-between border-b border-deep-charcoal/5 pb-1 dark:border-white/5">
              <span>Teeth Brushing</span>
              <span className="font-bold text-emerald-600">Done today</span>
            </div>
          </div>
        </Card>
      );
    }

    return null;
  };

  return (
    <PageWrapper
      title="AI Concierge"
      subtitle={`Chat with your pet care expert about ${activePet?.name || 'your pet'}`}
      action={
        <Button variant="outline" size="sm" onClick={clearChatHistory} className="flex items-center gap-2 cursor-pointer">
          <RefreshCw size={14} />
          <span>Reset Conversation</span>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
        
        {/* LEFT COLUMN: CHAT INTERFACE AREA (COL-SPAN 2) */}
        <div className="lg:col-span-2 flex flex-col border border-deep-charcoal/5 rounded-2xl overflow-hidden bg-pure-linen dark:bg-slate-velvet dark:border-white/5 h-full relative">
          
          {/* MESSAGES VIEW CONTAINER */}
          <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4">
            {chatHistory
              .filter((msg) => msg.petId === activePetId)
              .map((msg, idx, arr) => {
                const isAi = msg.role === 'assistant';
                const isStreaming = streamingMessageId === msg.id && !msg.isStreaming;
                const displayText = isStreaming ? streamingText : msg.content;
                
                // Get last user message for regeneration
                const prevUserMsg = !isAi && idx > 0 ? arr[idx - 1] : null;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isAi ? 'self-start' : 'self-end flex-row-reverse'}`}
                  >
                    <Avatar
                      src={isAi ? undefined : 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah'}
                      name={isAi ? 'AI' : 'Sarah'}
                      size="sm"
                      className={isAi ? 'bg-bloom-rose/15 text-bloom-rose border border-bloom-rose/15 shadow-xs' : ''}
                    />
                    <div className="flex flex-col gap-1.5">
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed transition-all shadow-xs
                          ${isAi
                            ? 'bg-warm-cream/65 text-deep-charcoal rounded-tl-xs dark:bg-white/5 dark:text-frosted-pearl'
                            : 'bg-bloom-rose text-white rounded-tr-xs'
                          }
                        `}
                      >
                        {/* Render simple markdown styling mock (bold strings, list items) */}
                        <div className="whitespace-pre-line">
                          {displayText.split('\n').map((line, lIdx) => {
                            if (line.startsWith('• ') || line.startsWith('* ')) {
                              return <li key={lIdx} className="ml-3 list-disc mt-1">{line.slice(2)}</li>;
                            }
                            return <p key={lIdx} className="mt-1 first:mt-0">{line}</p>;
                          })}
                        </div>

                        {/* Rich Card injection helper */}
                        {!isStreaming && isAi && getRichCard(msg.content)}
                      </div>

                      {/* Copy & Regenerate Shortcuts */}
                      {isAi && !isStreaming && (
                        <div className="flex gap-3 text-xxs text-warm-slate px-2 select-none">
                          <button
                            onClick={() => handleCopy(msg.content)}
                            className="inline-flex items-center gap-1 hover:text-bloom-rose cursor-pointer"
                          >
                            <Copy size={11} /> Copy
                          </button>
                          {prevUserMsg && (
                            <button
                              onClick={() => handleRegenerate(prevUserMsg.content)}
                              className="inline-flex items-center gap-1 hover:text-bloom-rose cursor-pointer"
                            >
                              <RefreshCw size={11} /> Regenerate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {sending && (
              <div className="flex gap-3 max-w-[80%] self-start">
                <Avatar name="AI" size="sm" className="bg-bloom-rose/15 text-bloom-rose animate-pulse" />
                <div className="bg-warm-cream/70 p-4 rounded-2xl rounded-tl-xs text-xs text-warm-slate flex items-center gap-2 dark:bg-white/5 dark:text-frosted-pearl/60">
                  <Sparkles size={14} className="animate-spin text-bloom-rose" />
                  <span>AI is compiling context recommendations...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* CHIPS AND INPUT PANEL */}
          <div className="flex flex-col gap-2 p-4 border-t border-deep-charcoal/5 dark:border-white/5 bg-pure-linen dark:bg-slate-velvet">
            
            {/* Suggestion Chips */}
            {chatHistory.filter((c) => c.petId === activePetId).length <= 2 && !sending && (
              <div className="flex flex-wrap gap-1.5 pb-2">
                {suggestionChips.map((chip) => (
                  <Chips key={chip} label={chip} onClick={() => handleSend(chip)} className="cursor-pointer text-xxs" />
                ))}
              </div>
            )}

            {/* Follow ups chips */}
            {chatHistory.filter((c) => c.petId === activePetId).length > 2 && !sending && (
              <div className="flex flex-wrap gap-1.5 pb-2">
                {followUps.map((chip) => (
                  <Chips key={chip} label={chip} onClick={() => handleSend(chip)} className="cursor-pointer text-xxs bg-bloom-rose/5 border-bloom-rose/10 text-bloom-rose" />
                ))}
              </div>
            )}

            {/* Input form */}
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask anything about ${activePet?.name || 'your pet'}'s health, daily calories...`}
                fullWidth
                className="rounded-full"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || sending}
                className="flex-shrink-0 w-11 h-11 rounded-full bg-bloom-rose hover:bg-bloom-rose/90 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-95 shadow-sm"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI VISUAL MEMORY TIMELINE & NOTIFIERS */}
        <div className="flex flex-col gap-6 h-full overflow-y-auto pr-1">
          
          {/* PET PROFILE INSIGHT SUMMARY */}
          <Card variant="glass" className="bg-gradient-to-br from-bloom-rose/5 to-transparent border-bloom-rose/15">
            <div className="flex gap-3 items-center">
              <Brain size={20} className="text-bloom-rose animate-pulse" />
              <div>
                <h4 className="text-xs font-bold font-display text-deep-charcoal dark:text-frosted-pearl">
                  AI Context Injection Mode
                </h4>
                <p className="text-xxs text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                  Feeding profile: {activePet?.breed} ({activePet?.weight} kg, {activePet?.gender})
                </p>
              </div>
            </div>
          </Card>

          {/* VISUAL MEMORY TIMELINE */}
          <Card variant="default">
            <h3 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-4 flex items-center gap-1.5">
              <Calendar size={16} className="text-warm-slate" />
              <span>AI Visual Memory Timeline</span>
            </h3>
            
            {activeMemoryLogs.length > 0 ? (
              <div className="flex flex-col gap-4 border-l border-deep-charcoal/5 pl-4 ml-2 dark:border-white/5 py-1">
                {activeMemoryLogs.map((item) => (
                  <div key={item.id} className="relative text-xxs">
                    {/* Stepper Node */}
                    <span className={`absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full border border-white dark:border-midnight-forest
                      ${item.severity === 'CRITICAL' ? 'bg-red-500 animate-ping' : ''}
                      ${item.severity === 'WARNING' ? 'bg-amber-500' : ''}
                      ${item.severity === 'INFO' ? 'bg-blue-500' : ''}
                    `} />
                    <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl leading-relaxed">
                      {item.event}
                    </span>
                    <p className="text-warm-slate dark:text-frosted-pearl/60 mt-0.5">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-warm-slate dark:text-frosted-pearl/60 text-center py-4">
                No memories logged yet.
              </p>
            )}
          </Card>

          {/* LONG-TERM CLINICAL REMINDERS */}
          <Card variant="default">
            <h3 className="text-sm font-bold font-display text-deep-charcoal dark:text-frosted-pearl mb-3">
              Long-Term Schedules
            </h3>
            {activeReminders.length > 0 ? (
              <div className="flex flex-col gap-2">
                {activeReminders.map((rem) => (
                  <div key={rem.id} className="text-xxs p-2 bg-warm-cream/50 rounded-xl dark:bg-white/5 border border-deep-charcoal/5 dark:border-white/5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-deep-charcoal dark:text-frosted-pearl">
                        {rem.title}
                      </span>
                      <p className="text-warm-slate mt-0.5">Due: {new Date(rem.dueTime).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="neutral">{rem.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-warm-slate dark:text-frosted-pearl/60 text-center py-2">
                No active booster schedules.
              </p>
            )}
          </Card>

        </div>

      </div>
    </PageWrapper>
  );
};
export default ChatPage;
