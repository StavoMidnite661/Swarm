import React, { useEffect, useState } from 'react';
import { CalendarEvent, fetchUpcomingEvents } from '../lib/workspaceUtils';
import { AlertCircle, Clock, Calendar } from 'lucide-react';

interface DailyBriefingProps {
  token: string | null;
}

export default function DailyBriefing({ token }: DailyBriefingProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUpcomingEvents(token)
        .then(setEvents)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) return <div className="p-4 text-white/30 text-[10px]">Syncing executive calendar...</div>;
  if (!events.length) return <div className="p-4 text-white/30 text-[10px]">No meetings scheduled.</div>;

  const topThree = events.slice(0, 3);

  return (
    <div className="p-4 space-y-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
      <div className="flex items-center gap-2 text-white/80 font-medium text-[11px] uppercase tracking-widest">
        <Calendar size={14} /> Daily Briefing
      </div>
      <div className="space-y-3">
        {topThree.map(event => (
          <div key={event.id} className="flex gap-3 items-start border-l border-white/10 pl-3">
            <Clock size={12} className="text-white/40 mt-0.5" />
            <div>
              <div className="text-white/90 text-[11px] font-medium">{event.summary}</div>
              <div className="text-white/40 text-[10px]">
                {event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All Day'}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-white/50 pt-2 border-t border-white/[0.05]">
        "I've surfaced your immediate priorities, CEO. Meetings are aligned with your strategic objectives."
      </div>
    </div>
  );
}
