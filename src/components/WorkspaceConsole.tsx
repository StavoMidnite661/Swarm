import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Mail, 
  Plus, 
  Trash2, 
  Loader2, 
  Send, 
  Check, 
  Sparkles, 
  RefreshCw, 
  LogOut, 
  Inbox, 
  Clock, 
  MapPin, 
  User,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  googleSignIn, 
  googleSignOut, 
  initAuthListener, 
  fetchUpcomingEvents, 
  fetchRecentEmails, 
  createCalendarEvent, 
  deleteCalendarEvent, 
  sendGmailEmail,
  CalendarEvent,
  GmailEmail
} from '../lib/workspaceUtils';
import { User as FirebaseUser } from 'firebase/auth';

interface WorkspaceConsoleProps {
  showToast: (msg: string) => void;
}

export default function WorkspaceConsole({ showToast }: WorkspaceConsoleProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Data States
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [emails, setEmails] = useState<GmailEmail[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Active Tab: 'calendar' | 'gmail'
  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'gmail'>('calendar');

  // Form States
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventSummary, setEventSummary] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventLoc, setEventLoc] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [submittingEvent, setSubmittingEvent] = useState(false);

  // Compose Email States
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [submittingEmail, setSubmittingEmail] = useState(false);

  // Expanded Email for reading/replying
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [draftingReply, setDraftingReply] = useState(false);

  // confirmation states
  const [destructiveEventId, setDestructiveEventId] = useState<string | null>(null);

  // Auth Initialization Listener
  useEffect(() => {
    const unsubscribe = initAuthListener(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setAuthInitialized(true);
      },
      () => {
        setUser(null);
        setToken(null);
        setAuthInitialized(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Workspace Data
  const loadWorkspaceData = async (accessToken: string) => {
    setDataLoading(true);
    try {
      const [fetchedEvents, fetchedEmails] = await Promise.all([
        fetchUpcomingEvents(accessToken).catch(err => {
          console.error(err);
          return [] as CalendarEvent[];
        }),
        fetchRecentEmails(accessToken).catch(err => {
          console.error(err);
          return [] as GmailEmail[];
        })
      ]);
      setEvents(fetchedEvents);
      setEmails(fetchedEmails);
    } catch (error) {
      showToast("Error retrieving Google Workspace datasets.");
    } finally {
      setDataLoading(false);
    }
  };

  // Fetch when token is loaded or refreshed
  useEffect(() => {
    if (token) {
      loadWorkspaceData(token);
    }
  }, [token]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        showToast("Sovereign Workspace Link successfully authenticated!");
      }
    } catch (err: any) {
      showToast(`Workspace Connection Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm("Confirm termination of Sovereign Workspace Session? Your temporary token will be purged.")) {
      try {
        await googleSignOut();
        setUser(null);
        setToken(null);
        setEvents([]);
        setEmails([]);
        showToast("Sovereign Workspace Session Terminated.");
      } catch (err) {
        showToast("Failed to clean session.");
      }
    }
  };

  // Handle Event Creation
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!eventSummary || !eventStart || !eventEnd) {
      showToast("Mandatory event parameters missing.");
      return;
    }

    setSubmittingEvent(true);
    try {
      await createCalendarEvent(token, {
        summary: eventSummary,
        description: eventDesc,
        location: eventLoc,
        startDateTime: new Date(eventStart).toISOString(),
        endDateTime: new Date(eventEnd).toISOString()
      });
      showToast("Executive Event scheduled on Google Calendar.");
      setShowEventForm(false);
      // Reset form
      setEventSummary('');
      setEventDesc('');
      setEventLoc('');
      setEventStart('');
      setEventEnd('');
      // Reload Calendar Events
      const updatedEvents = await fetchUpcomingEvents(token);
      setEvents(updatedEvents);
    } catch (err: any) {
      showToast(`Calendar Scheduling Failed: ${err.message || err}`);
    } finally {
      setSubmittingEvent(false);
    }
  };

  // Handle Destructive Event Deletion (With Confirmation Guard)
  const handleDeleteEventClick = (eventId: string) => {
    setDestructiveEventId(eventId);
  };

  const confirmDeleteEvent = async () => {
    if (!token || !destructiveEventId) return;
    try {
      await deleteCalendarEvent(token, destructiveEventId);
      showToast("Executive Event removed from Calendar.");
      setDestructiveEventId(null);
      // Reload
      const updatedEvents = await fetchUpcomingEvents(token);
      setEvents(updatedEvents);
    } catch (err: any) {
      showToast(`Failed to cancel event: ${err.message || err}`);
    }
  };

  // Handle Compose Email Send
  const handleSendComposeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;
    if (!emailTo || !emailSubject || !emailBody) {
      showToast("Destination or message criteria incomplete.");
      return;
    }

    setSubmittingEmail(true);
    try {
      await sendGmailEmail(token, emailTo, emailSubject, emailBody, user.email || 'me');
      showToast("Gmail Dispatch Dispatched Successfully.");
      setShowComposeForm(false);
      // Reset
      setEmailTo('');
      setEmailSubject('');
      setEmailBody('');
    } catch (err: any) {
      showToast(`Gmail Dispatch Failed: ${err.message || err}`);
    } finally {
      setSubmittingEmail(false);
    }
  };

  // Handle Sentinel Draft Assistance (James Bond Style Auto Draft!)
  const handleSentinelDraftAssist = (subject: string, sender: string, snippet: string, type: 'reply' | 'new') => {
    setDraftingReply(true);
    setTimeout(() => {
      const senderClean = sender.split('<')[0].trim();
      
      const bondDraft = `Good evening, ${senderClean}.

Regarding "${subject}":

I have reviewed the briefing data with Stavogm. We are proceeding with standard operations under full sovereign control. 
Let's coordinate a quick call at your earliest convenience to lock in the technical specifications.

Composed,
Sentinel
AI Technical Co-Founder`;

      if (type === 'reply') {
        setReplyBody(bondDraft);
      } else {
        setEmailBody(bondDraft);
      }
      setDraftingReply(false);
      showToast("Sentinel Draft Assist Generated (James Bond Profile).");
    }, 800);
  };

  // Handle Sending a Reply to an email
  const handleSendReply = async (email: GmailEmail) => {
    if (!token || !user) return;
    if (!replyBody) return;

    // Confirm sending
    if (!window.confirm(`Dispatched automated response to ${email.from}?`)) {
      return;
    }

    setDraftingReply(true);
    try {
      const cleanSubject = email.subject.toLowerCase().startsWith('re:') ? email.subject : `Re: ${email.subject}`;
      await sendGmailEmail(token, email.from, cleanSubject, replyBody.replace(/\n/g, '<br/>'), user.email || 'me');
      showToast(`Reply sent to ${email.from.split('<')[0].trim()}`);
      setReplyBody('');
      setExpandedEmailId(null);
    } catch (err: any) {
      showToast(`Failed to send reply: ${err.message || err}`);
    } finally {
      setDraftingReply(false);
    }
  };

  // Loading State for Auth Initialization
  if (!authInitialized) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[250px] text-zinc-400 font-sans text-xs">
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-white/90" />
        <span>BOOTING WORKSPACE SECURE GATEWAY...</span>
      </div>
    );
  }

  // Login Screen if no active session
  if (!token || !user) {
    return (
      <div className="p-6 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden min-h-[300px]" id="workspace-login-card">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        <div className="p-4 bg-white/5 border border-white/15 rounded-full text-white/80">
          <CalendarIcon className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2 max-w-sm">
          <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">Sovereign Google Workspace Gateway</h3>
          <p className="text-xs font-sans font-light text-zinc-400 leading-relaxed">
            Link Google Calendar and Gmail to empower Sentinel. Sentinel can proactively monitor your incoming mail, draft replies, and coordinate calendars securely.
          </p>
        </div>

        {/* Official-style customized Google Sign-In Button */}
        <button 
          onClick={handleSignIn}
          disabled={loading}
          className="flex items-center gap-3 px-5 py-3 bg-zinc-900 border border-white/10 hover:border-white/40/40 text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_24px_rgba(0,0,0,0.6)] group disabled:opacity-50"
          id="workspace-oauth-btn"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white/90" />
          ) : (
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 group-hover:scale-110 transition-transform">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          )}
          <span>AUTHENTICATE VIA GOOGLE SECURE PORT</span>
        </button>
      </div>
    );
  }

  // Authenticated Console Layout
  return (
    <div className="space-y-4" id="sovereign-workspace-console">
      {/* Active User Header */}
      <div className="flex justify-between items-center p-3 border border-white/10 bg-black/40 rounded-xl relative overflow-hidden" id="workspace-user-bar">
        <div className="flex items-center gap-2.5">
          {user.photoURL ? (
            <img src={user.photoURL} alt="User Avatar" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-white/20" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/90 font-sans text-sm uppercase">
              {user.displayName?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{user.displayName || 'Gustavo'}</span>
              <span className="px-1.5 py-0.2 bg-white/10 text-white/80 border border-white/15 text-[7px] font-sans rounded font-bold uppercase">SECURED LINK</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-sans tracking-wider">{user.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => loadWorkspaceData(token)}
            disabled={dataLoading}
            className="p-1.5 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-lg text-zinc-400 hover:text-white transition-all disabled:opacity-40"
            title="Reload Datasets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin text-white/90' : ''}`} />
          </button>
          <button 
            onClick={handleSignOut}
            className="p-1.5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-lg text-zinc-400 hover:text-white/80 transition-all"
            title="Terminate link Session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs Switcher for Google Workspace */}
      <div className="flex gap-1.5 border-b border-white/[0.08] pb-1" id="workspace-tabs-bar">
        <button
          onClick={() => setActiveSubTab('calendar')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans uppercase border-b-2 transition-all ${
            activeSubTab === 'calendar' 
              ? 'border-white/40 text-white/90 font-bold bg-white/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <CalendarIcon size={12} />
          <span>Calendar Node</span>
          <span className="text-[9px] px-1 bg-white/5 rounded text-zinc-400">{events.length}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('gmail')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans uppercase border-b-2 transition-all ${
            activeSubTab === 'gmail' 
              ? 'border-white/40 text-white/70 font-bold bg-white/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Mail size={12} />
          <span>Gmail Command</span>
          <span className="text-[9px] px-1 bg-white/5 rounded text-zinc-400">{emails.filter(e => e.unread).length || emails.length}</span>
        </button>
      </div>

      {/* Loading Indicator for Data fetch */}
      {dataLoading && events.length === 0 && emails.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center text-zinc-400 font-sans text-[10px]">
          <Loader2 className="w-5 h-5 mr-2 animate-spin text-white/90 mb-2" />
          <span>FETCHING WORSPACE ASSETS FROM GOOGLE APIs...</span>
        </div>
      )}

      {/* CALENDAR NODE TAB */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-3" id="calendar-view-panel">
          {/* Action Row */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-sans text-zinc-400">CALENDAR METRIC LAYER</span>
            <button
              onClick={() => setShowEventForm(!showEventForm)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/20 text-white/90 rounded-lg text-[10px] font-sans uppercase hover:bg-white/20 transition-all font-bold"
            >
              <Plus size={10} />
              <span>{showEventForm ? "Close Planner" : "Schedule Event"}</span>
            </button>
          </div>

          {/* Create Event Form */}
          {showEventForm && (
            <form onSubmit={handleCreateEvent} className="p-3.5 bg-black/55 border border-white/40/20 rounded-xl space-y-3" id="calendar-create-form">
              <h4 className="text-[10px] font-sans text-white/90 uppercase tracking-widest font-semibold">SCHEDULE SOVEREIGN DEPLOYMENT TIMEBLOCK</h4>
              
              <div className="space-y-2">
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-sans block mb-1">Event Summary</label>
                  <input
                    type="text"
                    required
                    value={eventSummary}
                    onChange={(e) => setEventSummary(e.target.value)}
                    placeholder="e.g., Swiss Escrow Settlement Strategy"
                    className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-white/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase font-sans block mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={eventStart}
                      onChange={(e) => setEventStart(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-white/40 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase font-sans block mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={eventEnd}
                      onChange={(e) => setEventEnd(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-white/40 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-sans block mb-1">Location</label>
                  <input
                    type="text"
                    value={eventLoc}
                    onChange={(e) => setEventLoc(e.target.value)}
                    placeholder="e.g., Secure Zurich Workspace (or Zoom Link)"
                    className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-white/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-sans block mb-1">Brief Description / Notes</label>
                  <textarea
                    rows={2}
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    placeholder="Brief description of executive topics..."
                    className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-white/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none resize-none font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="px-2.5 py-1 border border-white/10 hover:bg-white/5 rounded-md text-[10px] font-sans uppercase text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEvent}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white text-black font-bold font-sans rounded-md text-[10px] uppercase tracking-wider hover:bg-white/80 transition-all disabled:opacity-40"
                >
                  {submittingEvent ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Check size={10} />
                  )}
                  <span>PUBLISH TO GOOGLE CALENDAR</span>
                </button>
              </div>
            </form>
          )}

          {/* Event Deletion Confirmation Guard */}
          {destructiveEventId && (
            <div className="p-3 bg-white/10 border border-white/20 rounded-xl space-y-3" id="calendar-destructive-guard">
              <div className="flex items-start gap-2.5 text-white/80">
                <Trash2 size={16} className="text-white/60 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[10px] font-sans text-white/70 uppercase font-bold tracking-widest">DESTRUCTIVE OPERATION CONFIRMATION</h4>
                  <p className="text-[11px] font-sans text-white/70 leading-relaxed mt-1">
                    Are you sure you want to delete this event from your Google Calendar? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 text-[10px] font-sans">
                <button
                  onClick={() => setDestructiveEventId(null)}
                  className="px-2.5 py-1 bg-zinc-950 border border-white/10 text-zinc-400 hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteEvent}
                  className="px-3 py-1 bg-white/20 text-white font-bold rounded hover:bg-white/30 transition-all uppercase"
                >
                  Confirm Deletion
                </button>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {events.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 border border-white/[0.04] bg-white/[0.01] rounded-xl flex flex-col items-center justify-center">
                <Inbox size={20} className="text-zinc-600 mb-1" />
                <span className="text-[10px] font-sans uppercase">No upcoming Google Calendar events.</span>
              </div>
            ) : (
              events.map((evt) => {
                const startTime = evt.start.dateTime ? new Date(evt.start.dateTime) : (evt.start.date ? new Date(evt.start.date) : null);
                const timeString = startTime ? startTime.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'All Day';

                return (
                  <div key={evt.id} className="p-3 border border-white/10 hover:border-white/40/20 bg-black/40 hover:bg-black/50 rounded-xl flex justify-between items-start transition-all relative overflow-hidden group">
                    <div className="space-y-1 max-w-[85%]">
                      <h4 className="text-xs font-sans font-bold text-white group-hover:text-white/90 transition-colors line-clamp-1">{evt.summary}</h4>
                      
                      <div className="flex flex-wrap gap-2 text-[10px] text-zinc-400 font-sans">
                        <span className="flex items-center gap-1 font-sans text-zinc-500">
                          <Clock size={10} className="text-white/90" />
                          <span>{timeString}</span>
                        </span>
                        {evt.location && (
                          <span className="flex items-center gap-1 font-sans text-zinc-500 line-clamp-1">
                            <MapPin size={10} className="text-white/90" />
                            <span>{evt.location}</span>
                          </span>
                        )}
                      </div>
                      
                      {evt.description && (
                        <p className="text-[10px] font-sans text-zinc-500 font-light line-clamp-2 leading-relaxed mt-1">
                          {evt.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteEventClick(evt.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 bg-zinc-950 border border-white/5 text-zinc-500 hover:text-white/80 hover:border-white/20 rounded-lg transition-all"
                      title="Cancel Event"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* GMAIL COMMAND TAB */}
      {activeSubTab === 'gmail' && (
        <div className="space-y-3" id="gmail-view-panel">
          {/* Action Row */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-sans text-zinc-400">EMAIL PRIORITY POOL</span>
            <button
              onClick={() => setShowComposeForm(!showComposeForm)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/20 text-white/70 rounded-lg text-[10px] font-sans uppercase hover:bg-white/20 transition-all font-bold"
            >
              <Plus size={10} />
              <span>{showComposeForm ? "Close Drawer" : "Compose Mail"}</span>
            </button>
          </div>

          {/* Compose Email Form */}
          {showComposeForm && (
            <form onSubmit={handleSendComposeEmail} className="p-3.5 bg-black/55 border border-white/40/20 rounded-xl space-y-3" id="gmail-compose-form">
              <h4 className="text-[10px] font-sans text-white/70 uppercase tracking-widest font-semibold">COMPOSE EXECUTIVE TELEGRAM DISPATCH</h4>
              
              <div className="space-y-2">
                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-sans block mb-1">To (Destination)</label>
                  <input
                    type="email"
                    required
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-white/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-zinc-500 uppercase font-sans block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject Criterion"
                    className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-white/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] text-zinc-500 uppercase font-sans block">Message Criteria</label>
                    <button
                      type="button"
                      onClick={() => handleSentinelDraftAssist(emailSubject || '(Untitled)', emailTo || 'Partner', '', 'new')}
                      disabled={draftingReply}
                      className="text-[9px] text-white/80 hover:text-white/70 flex items-center gap-0.5 font-sans"
                    >
                      <Sparkles size={10} />
                      <span>{draftingReply ? "Generating..." : "Sentinel Autocompose (Bond Profile)"}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Enter confidential dispatch parameters..."
                    className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-white/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none resize-none font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowComposeForm(false)}
                  className="px-2.5 py-1 border border-white/10 hover:bg-white/5 rounded-md text-[10px] font-sans uppercase text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEmail}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white text-black font-bold font-sans rounded-md text-[10px] uppercase tracking-wider hover:bg-white/80 transition-all disabled:opacity-40"
                >
                  {submittingEmail ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send size={10} />
                  )}
                  <span>DISPATCH CONFIDENTIAL EMAIL</span>
                </button>
              </div>
            </form>
          )}

          {/* Emails List */}
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {emails.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 border border-white/[0.04] bg-white/[0.01] rounded-xl flex flex-col items-center justify-center">
                <Inbox size={20} className="text-zinc-600 mb-1" />
                <span className="text-[10px] font-sans uppercase">No recent emails in Inbox.</span>
              </div>
            ) : (
              emails.map((email) => {
                const isExpanded = expandedEmailId === email.id;
                const senderName = email.from.split('<')[0].replace(/"/g, '').trim();
                
                return (
                  <div 
                    key={email.id} 
                    className={`border rounded-xl transition-all overflow-hidden ${
                      isExpanded 
                        ? 'border-white/40/45 bg-white/5' 
                        : 'border-white/10 bg-black/40 hover:bg-black/50'
                    }`}
                  >
                    {/* Header summary clickable */}
                    <div 
                      onClick={() => setExpandedEmailId(isExpanded ? null : email.id)}
                      className="p-3 cursor-pointer flex justify-between items-start gap-2.5 group"
                    >
                      <div className="space-y-0.5 max-w-[80%]">
                        <div className="flex items-center gap-2">
                          {email.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse shrink-0" title="Unread" />
                          )}
                          <span className={`text-xs font-sans truncate block ${email.unread ? 'font-black text-white' : 'font-semibold text-zinc-300'}`}>
                            {senderName}
                          </span>
                        </div>
                        <h4 className={`text-[11px] font-sans truncate block ${email.unread ? 'font-bold text-zinc-100' : 'text-zinc-400'}`}>
                          {email.subject}
                        </h4>
                        {!isExpanded && (
                          <p className="text-[10px] font-sans text-zinc-500 truncate font-light leading-relaxed">
                            {email.snippet}
                          </p>
                        )}
                      </div>

                      <div className="text-right flex flex-col items-end gap-1.5 font-sans text-[9px] text-zinc-500">
                        <span>{email.date.split(',')[1]?.split('(')[0]?.trim() || email.date.split(' ')[0]}</span>
                        <div>
                          {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} className="group-hover:text-white/70 transition-colors" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail and Reply */}
                    {isExpanded && (
                      <div className="border-t border-white/[0.06] p-3.5 bg-black/40 space-y-3.5 animate-fadeIn">
                        <div className="space-y-1 bg-white/[0.02] border border-white/[0.05] p-2.5 rounded-lg text-xs font-sans text-zinc-300 font-light leading-relaxed">
                          <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-sans mb-1 pb-1 border-b border-white/[0.04]">
                            <User size={10} className="text-white/80" />
                            <span>Confidential Transcript from:</span>
                            <span className="text-white font-semibold">{email.from}</span>
                          </div>
                          <div className="whitespace-pre-wrap">{email.snippet}</div>
                        </div>

                        {/* Reply Builder Area */}
                        <div className="space-y-2 border-t border-white/[0.06] pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-sans text-zinc-400 uppercase font-bold">SECURE DRAFT TELEGRAM REPLY</span>
                            <button
                              type="button"
                              onClick={() => handleSentinelDraftAssist(email.subject, email.from, email.snippet, 'reply')}
                              disabled={draftingReply}
                              className="text-[9px] text-white/80 hover:text-white/70 flex items-center gap-0.5 font-sans"
                            >
                              <Sparkles size={10} className={draftingReply ? "animate-spin text-white/90" : ""} />
                              <span>Sentinel Assist</span>
                            </button>
                          </div>

                          <textarea
                            rows={3}
                            value={replyBody}
                            onChange={(e) => setReplyBody(e.target.value)}
                            placeholder={`Confidential reply context for ${senderName}...`}
                            className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 focus:border-white/40 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none resize-none font-sans"
                          />

                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setExpandedEmailId(null)}
                              className="px-2 py-1 bg-white/[0.02] border border-white/5 text-[10px] font-sans rounded text-zinc-400"
                            >
                              Collapse
                            </button>
                            <button
                              onClick={() => handleSendReply(email)}
                              disabled={!replyBody || draftingReply}
                              className="flex items-center gap-1 px-3 py-1 bg-white text-black font-bold font-sans text-[10px] rounded uppercase hover:bg-white/80 transition-all disabled:opacity-30"
                            >
                              <Send size={10} />
                              <span>Send Dispatch</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
