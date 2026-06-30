import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Edit2, Save, X, AlertTriangle, CheckCircle, Sparkles, 
  Play, Pause, Activity, Database, Plus, RefreshCw, Power, 
  Terminal, ShieldAlert, Volume2, Compass, Layers, Info, Eye, EyeOff,
  Briefcase, Users, Cpu, Coins, TrendingUp, ShieldCheck, Scale, 
  MessageSquare, Clock, ArrowUpRight, CheckSquare, FileText, Bell, 
  ChevronRight, ChevronLeft, History, UserCheck, MapPin, TrendingDown, Calendar as CalendarIcon,
  Mail, Send, Search, User, Phone, Check, ArrowRight, ChevronDown, ChevronUp, SearchCode, Settings
} from 'lucide-react';
import { PanelProps } from './CommandCenterProps';
import { 
  initAuthListener, 
  fetchUpcomingEvents, 
  fetchRecentEmails, 
  fetchGoogleContacts,
  createGoogleContact,
  googleSignIn,
  googleSignOut,
  createCalendarEvent, 
  deleteCalendarEvent, 
  sendGmailEmail,
  CalendarEvent, 
  GmailEmail, 
  WorkspaceContact 
} from '../lib/workspaceUtils';
import { User as FirebaseUser } from 'firebase/auth';

// Concentric touchscreen ripple feedback component for authentic simulation
const TouchRipple: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return (
    <span className="absolute inset-0 pointer-events-none rounded-inherit overflow-hidden flex items-center justify-center z-[1000]">
      <span className="absolute w-12 h-12 bg-white/10 rounded-full animate-ping" />
      <span className="absolute w-3 h-3 bg-white/40 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.4)] animate-pulse" />
    </span>
  );
};

// Define Mock Data for Seamless Out-of-the-box Experience (James Bond / Sovereign Theme)
const mockEvents: CalendarEvent[] = [
  {
    id: 'mock-evt-1',
    summary: 'Swiss Escrow Asset Allocation Audit',
    start: { dateTime: '2026-06-30T10:00:00-07:00' },
    end: { dateTime: '2026-06-30T11:00:00-07:00' },
    location: 'Zurich Private Vault Core',
    description: 'Final ledger audit of Sovereign reserves under full damping compliance.'
  },
  {
    id: 'mock-evt-2',
    summary: 'M16 Strategic Briefing (Agent Liaison)',
    start: { dateTime: '2026-07-02T14:00:00-07:00' },
    end: { dateTime: '2026-07-02T15:30:00-07:00' },
    location: 'London Safehouse Sector 7',
    description: 'Confidential briefing on risk containment. Charon conducting security sweeps.'
  },
  {
    id: 'mock-evt-3',
    summary: 'Titan Corp Web3 Takeover finalization',
    start: { dateTime: '2026-07-04T09:00:00-07:00' },
    end: { dateTime: '2026-07-04T10:30:00-07:00' },
    location: 'Sovereign Penthouse Executive Suite',
    description: 'Review escrow documents and acquire primary Web3 competitor Titan Corp.'
  }
];

const mockEmails: GmailEmail[] = [
  {
    id: 'mock-em-1',
    threadId: 'thread-1',
    from: 'M <director@mi6.gov.uk>',
    subject: 'Classified: Swiss Escrow Verification',
    snippet: 'Gustavo, we have confirmed the escrow parameters. Proceed with absolute discretion. Sentinel is monitoring the secure channels.',
    unread: true,
    date: 'Tue, 30 Jun 2026 09:15:22 GMT'
  },
  {
    id: 'mock-em-2',
    threadId: 'thread-2',
    from: 'Q <lab@mi6.gov.uk>',
    subject: 'Vanguard Tech Specs for Sovereign Core',
    snippet: 'Here are the encryption parameters for the new ledger systems. Tell Sentinel to run standard compilation tests immediately.',
    unread: false,
    date: 'Mon, 29 Jun 2026 16:30:00 GMT'
  },
  {
    id: 'mock-em-3',
    threadId: 'thread-3',
    from: 'Felix Leiter <felix@cia.gov>',
    subject: 'Titan Corp Intelligence Dossier',
    snippet: 'Titan reserves are heavily leveraged on offshore Web3 routing nodes. Perfect target for a takeover. Let\'s execute tomorrow.',
    unread: false,
    date: 'Sun, 28 Jun 2026 11:20:15 GMT'
  }
];

const mockContacts: WorkspaceContact[] = [
  {
    id: 'mock-ct-1',
    name: 'M (Director MI6)',
    title: 'Chief of Service',
    company: 'SIS / MI6 London',
    email: 'director@mi6.gov.uk',
    phone: '+44 20 7273 3000'
  },
  {
    id: 'mock-ct-2',
    name: 'Q (Lab Master)',
    title: 'Technical Director',
    company: 'Q-Branch Engineering',
    email: 'lab@mi6.gov.uk',
    phone: '+44 20 7273 4000'
  },
  {
    id: 'mock-ct-3',
    name: 'Felix Leiter',
    title: 'Senior Operations Liaison',
    company: 'CIA Langley',
    email: 'felix@cia.gov',
    phone: '+1 202 555 0143'
  },
  {
    id: 'mock-ct-4',
    name: 'Miss Moneypenny',
    title: 'Executive Coordinator',
    company: 'SIS Secretarial',
    email: 'coordinator@mi6.gov.uk',
    phone: '+44 20 7273 3500'
  },
  {
    id: 'mock-ct-5',
    name: 'Marcus Sterling',
    title: 'Managing Director',
    company: 'Sterling Capital Switzerland',
    email: 'marcus@sterling-cap.ch',
    phone: '+41 44 222 1100'
  }
];

export default function RightPanel(props: PanelProps) {
  const {
    speed, setSpeed, zoom, setZoom, singularity, setSingularity,
    resonance, setResonance, density, setDensity, proximity, setProximity,
    wind, setWind, colorMode, setColorMode, pulseFreq, setPulseFreq,
    activeRoom, setActiveRoom, timeQuarter, setTimeQuarter,
    messages, chatInput, setChatInput, handleSendMessage,
    isAgentConnected, isAgentConnecting, connectAgent, disconnectAgent,
    isAgentDormant, setIsAgentDormant, modelConfig, setModelConfig,
    yaw, pitch,
    rightTab, setRightTab, showAddMission, setShowAddMission,
    newMissionName, setNewMissionName, newMissionDept, setNewMissionDept,
    newMissionMilestone, setNewMissionMilestone, notification, setNotification,
    debateScenario, setDebateScenario, isDebating, setIsDebating,
    debateStep, setDebateStep, debateLogs, setDebateLogs, debateResult, setDebateResult,
    showToast, runSimulationDebate,

    // SOVR OS Core Bindings
    sovrState,
    operationalAnswers,
    createMission,
    toggleTaskDone,
    addMemoryFact,
    deleteMemoryFact,
    toggleDamping,
    resolveApproval
  } = props;

  // Local state for custom manual memory input
  const [manualMemoryInput, setManualMemoryInput] = useState('');

  // Google Workspace States
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Active Data State Lists (Live + Mock Fallbacks)
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [emails, setEmails] = useState<GmailEmail[]>(mockEmails);
  const [contacts, setContacts] = useState<WorkspaceContact[]>(mockContacts);

  // Search & Filter States
  const [emailSearch, setEmailSearch] = useState('');
  const [emailFilter, setEmailFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);
  const [emailReplyText, setEmailReplyText] = useState('');
  const [showEmailCompose, setShowEmailCompose] = useState(false);
  const [emailComposeTo, setEmailComposeTo] = useState('');
  const [emailComposeSubject, setEmailComposeSubject] = useState('');
  const [emailComposeBody, setEmailComposeBody] = useState('');

  // Calendar View Settings
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 5, 30)); // Default matching today's system date June 30, 2026
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [calFormSummary, setCalFormSummary] = useState('');
  const [calFormLoc, setCalFormLoc] = useState('');
  const [calFormStart, setCalFormStart] = useState('2026-06-30T10:00');
  const [calFormEnd, setCalFormEnd] = useState('2026-06-30T11:00');
  const [calFormDesc, setCalFormDesc] = useState('');

  // Contacts States
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactTitle, setNewContactTitle] = useState('');
  const [newContactCompany, setNewContactCompany] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Autonomic Simulation States (Multi-stage visual autopilot)
  const [simActive, setSimActive] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simType, setSimType] = useState<'calendar' | 'email' | 'contact' | null>(null);
  const [simTypingText, setSimTypingText] = useState('');
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 }); // Cursor coordinates in percentage
  const [cursorClicking, setCursorClicking] = useState(false);

  // References for layout targets
  const panelRef = useRef<HTMLDivElement>(null);

  // Auth Listener
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

  const handleConnectGoogle = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        showToast("Sovereign operational tunnel established with Google Workspace.");
      }
    } catch (err: any) {
      showToast(`Google Auth Tunnel failed: ${err.message || err}`);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
      showToast("Google Workspace connection severed securely.");
    } catch (err: any) {
      showToast(`Failed to disconnect: ${err.message || err}`);
    }
  };

  // Fetch Live Data
  const loadLiveWorkspaceData = async (accessToken: string) => {
    setDataLoading(true);
    try {
      const [fetchedEvents, fetchedEmails, fetchedContacts] = await Promise.all([
        fetchUpcomingEvents(accessToken).catch(() => mockEvents),
        fetchRecentEmails(accessToken).catch(() => mockEmails),
        fetchGoogleContacts(accessToken).catch(() => mockContacts)
      ]);
      setEvents(fetchedEvents.length > 0 ? fetchedEvents : mockEvents);
      setEmails(fetchedEmails.length > 0 ? fetchedEmails : mockEmails);
      setContacts(fetchedContacts.length > 0 ? fetchedContacts : mockContacts);
    } catch (e) {
      console.error(e);
      showToast("Workspace Live Sync limited. Falling back to secure cache.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadLiveWorkspaceData(token);
    } else {
      setEvents(mockEvents);
      setEmails(mockEmails);
      setContacts(mockContacts);
    }
  }, [token]);

  useEffect(() => {
    const handleMutation = (e: Event) => {
      const customEvent = e as CustomEvent;
      const action = customEvent.detail?.action;
      if (token) {
        loadLiveWorkspaceData(token);
        if (action) {
          showToast(`Co-founder executed action: synced '${action}' Google Database in real-time.`);
        }
      }
    };
    window.addEventListener('workspace-mutated', handleMutation);
    return () => window.removeEventListener('workspace-mutated', handleMutation);
  }, [token]);

  const handleAddMemoryFact = () => {
    if (!manualMemoryInput.trim()) return;
    addMemoryFact(manualMemoryInput.trim(), 'STRATEGIC');
    setManualMemoryInput('');
    showToast("Semantic rule integrated with Core 06 Memory nodes.");
  };

  // -----------------------------------------------------------------
  // AUTONOMOUS AGENT SIMULATOR ENGINE (Touchscreen State Machine)
  // -----------------------------------------------------------------
  const triggerSimulation = (type: 'calendar' | 'email' | 'contact') => {
    if (simActive) return;
    setSimActive(true);
    setSimStep(0);
    setSimType(type);
    setSimLogs([`[INITIALIZING SHARD] Autonomic Proxy active on port 3000.`]);
    setCursorPos({ x: 50, y: 50 });
  };

  const isTargetActive = (targetName: string): boolean => {
    if (!simActive) return false;
    if (simType === 'calendar') {
      if (targetName === 'tab-calendar' && simStep === 0) return true;
      if (targetName === 'btn-schedule' && simStep === 1) return true;
      if (targetName === 'input-cal-summary' && simStep === 2) return true;
      if (targetName === 'input-cal-details' && simStep === 3) return true;
      if (targetName === 'btn-cal-publish' && simStep === 4) return true;
    }
    if (simType === 'email') {
      if (targetName === 'tab-email' && simStep === 0) return true;
      if (targetName === 'btn-compose' && simStep === 1) return true;
      if (targetName === 'input-email-to' && simStep === 2) return true;
      if (targetName === 'input-email-subject' && simStep === 3) return true;
      if (targetName === 'input-email-body' && simStep === 4) return true;
      if (targetName === 'btn-email-send' && simStep === 5) return true;
    }
    if (simType === 'contact') {
      if (targetName === 'tab-contacts' && simStep === 0) return true;
      if (targetName === 'btn-new-contact' && simStep === 1) return true;
      if (targetName === 'input-contact-details' && simStep === 2) return true;
      if (targetName === 'btn-contact-save' && simStep === 3) return true;
    }
    return false;
  };

  const getSimClass = (targetName: string, baseClasses: string = '') => {
    const active = isTargetActive(targetName);
    return `${baseClasses} relative transition-all duration-300 ${
      active 
        ? 'scale-[0.98] border-white/40! text-white! ring-1 ring-white/20 bg-white/10 shadow-[0_0_16px_rgba(255,255,255,0.15)]' 
        : ''
    }`;
  };

  useEffect(() => {
    if (!simActive || !simType) return;

    let timer: NodeJS.Timeout;

    const runSimulationStep = async () => {
      if (simType === 'calendar') {
        switch (simStep) {
          case 0:
            // Step 0: Switch to Calendar Tab
            setSimLogs(prev => [...prev, "🤖 [ROUTING] Touching display context to Calendar Subsystem."]);
            timer = setTimeout(() => {
              setRightTab('calendar');
              setSimStep(1);
            }, 1200);
            break;

          case 1:
            // Step 1: Open event creator form
            setSimLogs(prev => [...prev, "🤖 [FORM_OPEN] Tapping Google Calendar Schedule drawer button."]);
            timer = setTimeout(() => {
              setShowCalendarForm(true);
              setSimStep(2);
              setSimTypingText('');
            }, 1200);
            break;

          case 2:
            // Step 2: Simulated typing of Event Summary
            setSimLogs(prev => [...prev, "🤖 [TYPING] Accessing virtual keys: \"Swiss Escrow Audit Review\""]);
            setCalFormSummary('');
            const summaryText = "Swiss Escrow Audit Review";
            let curChar = 0;
            const typeInterval = setInterval(() => {
              if (curChar < summaryText.length) {
                setCalFormSummary(prev => prev + summaryText[curChar]);
                setSimTypingText(prev => prev + summaryText[curChar]);
                curChar++;
              } else {
                clearInterval(typeInterval);
                setSimStep(3);
              }
            }, 50);
            break;

          case 3:
            // Step 3: Setting location and details
            setSimLogs(prev => [...prev, "🤖 [METADATA] Filling details, location & Swiss compliance nodes."]);
            setCalFormLoc("Zurich Core Private Vault");
            setCalFormStart("2026-06-30T10:00");
            setCalFormEnd("2026-06-30T11:00");
            
            setCalFormDesc('');
            const descText = "Sovereign reserve auditing and EIOS telemetry handshake.";
            let curCharDesc = 0;
            const descInterval = setInterval(() => {
              if (curCharDesc < descText.length) {
                setCalFormDesc(prev => prev + descText[curCharDesc]);
                curCharDesc++;
              } else {
                clearInterval(descInterval);
                setSimStep(4);
              }
            }, 30);
            break;

          case 4:
            // Step 4: Submit and save event
            setSimLogs(prev => [...prev, "🤖 [COMMIT] Transmitting transactional record via OAuth token..."]);
            timer = setTimeout(async () => {
              const summary = calFormSummary || "Swiss Escrow Audit Review";
              const location = calFormLoc || "Zurich Core Private Vault";
              const description = calFormDesc || "Sovereign reserve auditing and EIOS telemetry handshake.";
              
              let actualEvent: CalendarEvent | null = null;
              if (token) {
                try {
                  actualEvent = await createCalendarEvent(token, {
                    summary,
                    location,
                    description,
                    startDateTime: new Date(calFormStart).toISOString(),
                    endDateTime: new Date(calFormEnd).toISOString()
                  });
                  showToast("✅ Live Google Calendar Event published!");
                } catch (err) {
                  console.error("Simulation calendar API error:", err);
                }
              }

              const newEvt: CalendarEvent = actualEvent || {
                id: `sim-evt-${Date.now()}`,
                summary,
                start: { dateTime: new Date(calFormStart).toISOString() },
                end: { dateTime: new Date(calFormEnd).toISOString() },
                location,
                description
              };

              setEvents(prev => [newEvt, ...prev]);
              setShowCalendarForm(false);
              setCalFormSummary('');
              setCalFormDesc('');
              setCalFormLoc('');

              showToast("✅ Calendar Event Created: 'Swiss Escrow Audit Review' on June 30, 2026");
              setSimLogs(prev => [...prev, "✅ [SUCCESS] Google Calendar successfully mutated and compiled."]);
              setSimStep(5);
            }, 1500);
            break;

          case 5:
            // Completed
            timer = setTimeout(() => {
              setSimActive(false);
              setSimType(null);
            }, 1200);
            break;
        }
      } else if (simType === 'email') {
        switch (simStep) {
          case 0:
            // Step 0: Switch to Email Tab
            setSimLogs(prev => [...prev, "🤖 [ROUTING] Switching display context to Gmail Command node."]);
            timer = setTimeout(() => {
              setRightTab('email');
              setSimStep(1);
            }, 1200);
            break;

          case 1:
            // Step 1: Open Compose modal
            setSimLogs(prev => [...prev, "🤖 [FORM_OPEN] Triggering SMTP Compose modal."]);
            timer = setTimeout(() => {
              setShowEmailCompose(true);
              setSimStep(2);
            }, 1200);
            break;

          case 2:
            // Step 2: Types recipient
            setSimLogs(prev => [...prev, "🤖 [TYPING] Specifying recipient: board@sovereign-os.co"]);
            setEmailComposeTo('');
            const toStr = "board@sovereign-os.co";
            let cIdx = 0;
            const toInterval = setInterval(() => {
              if (cIdx < toStr.length) {
                setEmailComposeTo(prev => prev + toStr[cIdx]);
                cIdx++;
              } else {
                clearInterval(toInterval);
                setSimStep(3);
              }
            }, 40);
            break;

          case 3:
            // Step 3: Types subject
            setSimLogs(prev => [...prev, "🤖 [TYPING] Setting Subject header: \"Q3 Operational Intelligence Audit\""]);
            setEmailComposeSubject('');
            const subStr = "Q3 Operational Intelligence Audit";
            let sIdx = 0;
            const subInterval = setInterval(() => {
              if (sIdx < subStr.length) {
                setEmailComposeSubject(prev => prev + subStr[sIdx]);
                sIdx++;
              } else {
                clearInterval(subInterval);
                setSimStep(4);
              }
            }, 40);
            break;

          case 4:
            // Step 4: Types body
            setSimLogs(prev => [...prev, "🤖 [TYPING] Formulating Bond-style Executive Briefing body..."]);
            setEmailComposeBody('');
            const bodyStr = "Gentlemen,\n\nThe Sovereign OS Kernel is enabled. Autonomic shards are executing standard debentures under full security damping.\n\nFull co-founder capabilities are online.\n\nComposed,\nSentinel";
            let bIdx = 0;
            const bodyInterval = setInterval(() => {
              if (bIdx < bodyStr.length) {
                setEmailComposeBody(prev => prev + bodyStr[bIdx]);
                bIdx++;
              } else {
                clearInterval(bodyInterval);
                setSimStep(5);
              }
            }, 25);
            break;

          case 5:
            // Step 5: Click Send
            setSimLogs(prev => [...prev, "🤖 [COMMIT] Transmitting dispatch over TLS pipe..."]);
            timer = setTimeout(async () => {
              const to = emailComposeTo || "board@sovereign-os.co";
              const subject = emailComposeSubject || "Q3 Operational Intelligence Audit";
              const body = emailComposeBody || "Gentlemen,\n\nThe Sovereign OS Kernel is enabled. Autonomic shards are executing standard debentures under full security damping.\n\nFull co-founder capabilities are online.\n\nComposed,\nSentinel";
              
              let actualSuccess = false;
              if (token && user?.email) {
                try {
                  actualSuccess = await sendGmailEmail(token, to, subject, body, user.email);
                  showToast("✅ Live email dispatched via Gmail API!");
                } catch (err) {
                  console.error("Simulation email API error:", err);
                }
              }

              const newMail: GmailEmail = {
                id: `sim-em-${Date.now()}`,
                threadId: `thread-sim-${Date.now()}`,
                from: user?.email ? `Sovereign Board <${user.email}>` : "Sovereign Board <board@sovereign-os.co>",
                subject,
                snippet: body.substring(0, 100) + "...",
                unread: false,
                date: new Date().toUTCString()
              };

              setEmails(prev => [newMail, ...prev]);
              setShowEmailCompose(false);
              setEmailComposeTo('');
              setEmailComposeSubject('');
              setEmailComposeBody('');

              showToast("✅ Secure Email dispatched successfully to board@sovereign-os.co!");
              setSimLogs(prev => [...prev, "✅ [SUCCESS] Gmail relay completed successfully."]);
              setSimStep(6);
            }, 1500);
            break;

          case 6:
            // Completed
            timer = setTimeout(() => {
              setSimActive(false);
              setSimType(null);
            }, 1200);
            break;
        }
      } else if (simType === 'contact') {
        switch (simStep) {
          case 0:
            // Step 0: Switch to Contacts Tab
            setSimLogs(prev => [...prev, "🤖 [ROUTING] Switching display context to Rolodex Contact Matrix."]);
            timer = setTimeout(() => {
              setRightTab('contacts');
              setSimStep(1);
            }, 1200);
            break;

          case 1:
            // Step 1: Open contact creator form
            setSimLogs(prev => [...prev, "🤖 [FORM_OPEN] Loading executive rolodex card generator."]);
            timer = setTimeout(() => {
              setShowContactForm(true);
              setSimStep(2);
            }, 1200);
            break;

          case 2:
            // Step 2: Types contact details
            setSimLogs(prev => [...prev, "🤖 [TYPING] Registering legal counsel dossier: Marcus Sterling."]);
            setNewContactName('');
            setNewContactTitle("Managing Director");
            setNewContactCompany("Sterling Capital Switzerland");
            setNewContactEmail("marcus@sterling-cap.ch");
            setNewContactPhone("+41 44 222 1100");
            const nameStr = "Marcus Sterling";
            let nIdx = 0;
            const nameInterval = setInterval(() => {
              if (nIdx < nameStr.length) {
                setNewContactName(prev => prev + nameStr[nIdx]);
                nIdx++;
              } else {
                clearInterval(nameInterval);
                setSimStep(3);
              }
            }, 50);
            break;

          case 3:
            // Step 3: Click Save
            setSimLogs(prev => [...prev, "🤖 [COMMIT] Storing identity keys on Google People API secure shard..."]);
            timer = setTimeout(() => {
              const newContact: WorkspaceContact = {
                id: `sim-ct-${Date.now()}`,
                name: newContactName || "Marcus Sterling",
                title: newContactTitle || "Managing Director",
                company: newContactCompany || "Sterling Capital Switzerland",
                email: newContactEmail || "marcus@sterling-cap.ch",
                phone: newContactPhone || "+41 44 222 1100"
              };

              setContacts(prev => [newContact, ...prev]);
              setShowContactForm(false);
              setNewContactName('');
              setNewContactTitle('');
              setNewContactCompany('');
              setNewContactEmail('');
              setNewContactPhone('');

              showToast("✅ Rolodex updated: Saved contact 'Marcus Sterling'");
              setSimLogs(prev => [...prev, "✅ [SUCCESS] Sovereign Rolodex keys written."]);
              setSimStep(4);
            }, 1500);
            break;

          case 4:
            // Completed
            timer = setTimeout(() => {
              setSimActive(false);
              setSimType(null);
            }, 1200);
            break;
        }
      }
    };

    runSimulationStep();

    return () => clearTimeout(timer);
  }, [simActive, simStep, simType]);

  // Calendar calculations
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Filtered lists
  const filteredEmails = emails.filter(em => {
    const matchesSearch = em.subject.toLowerCase().includes(emailSearch.toLowerCase()) || 
                          em.from.toLowerCase().includes(emailSearch.toLowerCase()) ||
                          em.snippet.toLowerCase().includes(emailSearch.toLowerCase());
    if (emailFilter === 'unread') return matchesSearch && em.unread;
    if (emailFilter === 'starred') return matchesSearch && (em as any).starred;
    return matchesSearch;
  });

  const filteredContacts = contacts.filter(ct => {
    return ct.name.toLowerCase().includes(contactSearch.toLowerCase()) || 
           ct.title.toLowerCase().includes(contactSearch.toLowerCase()) ||
           ct.company.toLowerCase().includes(contactSearch.toLowerCase());
  });

  const handleManualCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calFormSummary) return;
    const startIso = new Date(calFormStart).toISOString();
    const endIso = new Date(calFormEnd).toISOString();

    if (token) {
      try {
        const created = await createCalendarEvent(token, {
          summary: calFormSummary,
          description: calFormDesc,
          location: calFormLoc,
          startDateTime: startIso,
          endDateTime: endIso,
        });
        setEvents(prev => [created, ...prev]);
        showToast(`Google Calendar event scheduled successfully for reals!`);
      } catch (err: any) {
        showToast(`Failed to publish event to Google: ${err.message || err}`);
      }
    } else {
      const newEvt: CalendarEvent = {
        id: `manual-evt-${Date.now()}`,
        summary: calFormSummary,
        start: { dateTime: startIso },
        end: { dateTime: endIso },
        location: calFormLoc,
        description: calFormDesc
      };
      setEvents(prev => [newEvt, ...prev]);
      showToast(`Scheduled local offline calendar event: '${calFormSummary}'`);
    }

    setShowCalendarForm(false);
    setCalFormSummary('');
    setCalFormDesc('');
    setCalFormLoc('');
  };

  const handleManualComposeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailComposeTo || !emailComposeSubject) return;

    if (token) {
      try {
        await sendGmailEmail(token, emailComposeTo, emailComposeSubject, emailComposeBody, user?.email || "me");
        showToast(`Email dispatched for reals via connected Gmail account!`);
        loadLiveWorkspaceData(token);
      } catch (err: any) {
        showToast(`Failed to dispatch Gmail email: ${err.message || err}`);
      }
    } else {
      const newMail: GmailEmail = {
        id: `manual-em-${Date.now()}`,
        threadId: `thread-manual-${Date.now()}`,
        from: `Gustavo <${user?.email || 'stavogm@gmail.com'}>`,
        subject: emailComposeSubject,
        snippet: emailComposeBody,
        unread: false,
        date: new Date().toUTCString()
      };
      setEmails(prev => [newMail, ...prev]);
      showToast(`Dispatched local offline email telegram to ${emailComposeTo}`);
    }

    setShowEmailCompose(false);
    setEmailComposeTo('');
    setEmailComposeSubject('');
    setEmailComposeBody('');
  };

  const handleManualCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName) return;

    if (token) {
      try {
        const created = await createGoogleContact(token, newContactName, newContactTitle, newContactCompany, newContactEmail, newContactPhone);
        setContacts(prev => [created, ...prev]);
        showToast(`Dossier connection added for reals to Google Contacts!`);
      } catch (err: any) {
        showToast(`Failed to sync contact to Google: ${err.message || err}`);
      }
    } else {
      const newCt: WorkspaceContact = {
        id: `manual-ct-${Date.now()}`,
        name: newContactName,
        title: newContactTitle,
        company: newContactCompany,
        email: newContactEmail,
        phone: newContactPhone
      };
      setContacts(prev => [newCt, ...prev]);
      showToast(`Saved local offline dossier contact: '${newContactName}'`);
    }

    setShowContactForm(false);
    setNewContactName('');
    setNewContactTitle('');
    setNewContactCompany('');
    setNewContactEmail('');
    setNewContactPhone('');
  };

  const handleSendEmailReply = async (email: GmailEmail) => {
    if (!emailReplyText.trim()) return;

    if (token) {
      try {
        await sendGmailEmail(token, email.from, `Re: ${email.subject}`, emailReplyText, user?.email || "me");
        showToast(`Sent real email reply telegram to recipient via Gmail!`);
        loadLiveWorkspaceData(token);
      } catch (err: any) {
        showToast(`Failed to reply via Gmail: ${err.message || err}`);
      }
    } else {
      showToast(`Dispatched local offline reply telegram to ${email.from.split('<')[0].trim()}`);
    }

    setEmailReplyText('');
    setExpandedEmailId(null);
  };

  const lettersScrubber = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <>
      {/* SECURE COMMS & AUDIT STREAM - Glass Right Panel */}
      <div className="lg:col-span-4 flex flex-col gap-3 h-full overflow-hidden relative" id="secure-right-panel" ref={panelRef}>
        
        <div className="flex-1 bg-gradient-to-br from-[#121212] via-[#050505] to-[#0a0a0a] backdrop-blur-[40px] border border-white/[0.05] rounded-3xl p-6 flex flex-col gap-5 shadow-[0_10px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden relative">
          {/* Subtle Ambient Reflector */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-violet/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent-cyan/5 via-transparent to-transparent pointer-events-none" />
          
          {/* PERSISTENT REAL-WORLD GOOGLE WORKSPACE STATUS INTEGRITY BANNER */}
          <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-[12px] shrink-0 font-sans text-[11px] relative overflow-hidden" id="workspace-intelligence-status-banner">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${token ? 'bg-white/80' : 'bg-white/20'} animate-pulse`} />
                <span className="font-medium text-white/90 tracking-wide uppercase text-[10px]">Sovereign Google Workspace Link</span>
              </div>
              <span className="text-white/50 text-[9px] font-medium uppercase tracking-widest">
                {token ? `Sync Active` : `Offline Standby`}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-black/20 border border-white/[0.08] p-3 rounded-[8px]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1 h-1 rounded-full ${token ? 'bg-white/60' : 'bg-white/20'}`} />
                  <span className="text-[9px] text-white/60 font-medium uppercase tracking-widest">Calendar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1 h-1 rounded-full ${token ? 'bg-white/60' : 'bg-white/20'}`} />
                  <span className="text-[9px] text-white/60 font-medium uppercase tracking-widest">Gmail</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1 h-1 rounded-full ${token ? 'bg-white/60' : 'bg-white/20'}`} />
                  <span className="text-[9px] text-white/60 font-medium uppercase tracking-widest">Contacts</span>
                </div>
              </div>

              {token ? (
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-white/50 truncate max-w-[120px] font-medium tracking-wide">{user?.email}</span>
                  <button 
                    onClick={handleDisconnectGoogle}
                    className="px-3 py-1 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/90 font-medium rounded-md uppercase text-[9px] transition-all tracking-widest"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAgentDormant(!isAgentDormant)}
                  className={`px-3 py-1 border shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:bg-white/[0.12] text-white font-medium rounded-md uppercase text-[9px] transition-all flex items-center gap-1.5 tracking-widest ${
                    isAgentDormant ? 'bg-emerald-900/30 border-emerald-500/30' : 'bg-white/[0.08] border-white/[0.15]'
                  }`}
                >
                  <Power size={10} />
                  <span>{isAgentDormant ? 'Engage' : 'Stand Down'}</span>
                </button>
              )}
            </div>
          </div>

          {/* SCROLLABLE HORIZONTAL TAB BAR */}
          <div className="flex gap-2 border-b border-white/[0.04] pb-3 shrink-0 overflow-x-auto select-none no-scrollbar relative">
            {[
              { id: 'comms', label: 'Comms', icon: MessageSquare },
              { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'contacts', label: 'Contacts', icon: Users },
              { id: 'timeline', label: 'Timeline', icon: Clock },
              { id: 'memory', label: 'Memory', icon: Database },
              { id: 'approvals', label: 'Ledger Gates', icon: ShieldCheck },
              { id: 'config', label: 'Config', icon: Settings },
            ].map(tab => {
              const active = rightTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRightTab(tab.id as any)}
                  className={getSimClass(`tab-${tab.id}`, `relative px-2 py-2 flex-1 flex items-center justify-center transition-all text-[12px] font-sans tracking-widest uppercase font-medium rounded-md overflow-hidden ${
                    active ? 'text-white bg-white/[0.06] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.02]'
                  }`)}
                >
                  <Icon size={16} />
                  <TouchRipple active={isTargetActive(`tab-${tab.id}`)} />
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT: COMMS (Muted Voice + Sovereign order input) */}
          {rightTab === 'comms' && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-[12px] flex items-center justify-between shrink-0 font-sans text-xs tracking-wide shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${isAgentConnected ? 'bg-white/80' : 'bg-white/20'} shrink-0`} />
                  <div className="flex flex-col">
                    <span className="font-medium text-white/90 uppercase tracking-[0.15em] text-[11px]">EIOS Voice Link</span>
                    <span className="text-[9px] text-white/50 uppercase tracking-widest mt-0.5">
                      {isAgentConnecting ? 'Establishing Link...' : isAgentConnected ? 'Voice channel open' : 'Standby'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isAgentConnected ? (
                    <button 
                      onClick={disconnectAgent}
                      className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/90 font-medium text-[9px] tracking-widest uppercase rounded-md transition-all"
                    >
                      Mute Link
                    </button>
                  ) : (
                    <button 
                      disabled={isAgentConnecting}
                      onClick={connectAgent}
                      className="px-3 py-1.5 bg-white/[0.08] border border-white/[0.15] shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:bg-white/[0.12] text-white font-medium text-[9px] tracking-widest uppercase rounded-md transition-all"
                    >
                      {isAgentConnecting ? 'Connecting...' : 'Start Voice Link'}
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic PCM Audio Stream Indicator */}
              {isAgentConnected && (
                <div className="p-3 bg-black/20 border border-white/[0.08] rounded-xl shrink-0 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[9px] font-sans text-white/50 uppercase tracking-widest font-medium">
                    <span>Real-Time Voice Amplitude (PCM)</span>
                    <span className="text-white/90 font-medium">
                      {(window as any)._agentAudio > 0 ? 'Active Transmission' : 'Standby'}
                    </span>
                  </div>
                  <div className="flex-1 flex gap-1 items-end h-5 overflow-hidden border-b border-white/[0.04] pb-1">
                    {[...Array(16)].map((_, idx) => {
                      const isSustained = (window as any)._agentAudio > 0.05;
                      const heightPct = isSustained ? Math.floor(Math.random() * 80) + 20 : Math.floor(Math.random() * 15) + 5;
                      return (
                        <div 
                          key={idx} 
                          className={`flex-1 rounded-sm transition-all duration-100 ${isSustained ? 'bg-white/80' : 'bg-white/20'}`}
                          style={{ height: `${heightPct}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chat Output message stream */}
              <div className="flex-1 border border-white/[0.08] rounded-[16px] bg-black/20 overflow-hidden flex flex-col relative min-h-[140px]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-40 p-4">
                      <Terminal className="w-6 h-6 text-white" />
                      <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-white font-medium">
                        Executive Communications
                      </div>
                      <p className="text-[10px] font-sans text-white/70 max-w-[240px] leading-relaxed tracking-wide">
                        Brainstorm strategies with Sentinel. Type an executive order below to route pipelines.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className="text-[9px] font-sans text-white/50 uppercase tracking-widest mb-1 font-medium">
                          {msg.sender === 'user' ? 'Founder' : 'Sentinel'}
                        </div>
                        <div className={`px-3.5 py-2.5 rounded-[12px] text-[11px] font-sans whitespace-pre-wrap max-w-[95%] border leading-relaxed tracking-wide ${
                          msg.sender === 'user' 
                            ? 'bg-white/[0.04] text-white border-white/[0.08] rounded-br-[4px]' 
                            : msg.text.startsWith('✨') 
                              ? 'bg-white/[0.02] text-white/90 border-white/[0.1] rounded-bl-[4px]'
                              : 'bg-black/40 text-white/80 border-white/[0.04] rounded-bl-[4px]'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Command Text Transmit */}
              <div className="relative shrink-0">
                <input 
                  type="text" 
                  placeholder="Transmit executive command..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  className="w-full bg-white/[0.02] border border-white/10 pl-3 pr-20 py-2.5 text-xs font-sans text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 rounded-lg" 
                />
                <button 
                  disabled={!chatInput.trim()}
                  onClick={handleSendMessage}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-white/10 text-white/90 hover:bg-white/20 disabled:opacity-20 rounded-md font-sans text-xs transition-all"
                >
                  Transmit
                </button>
              </div>
            </div>
          )}

          {/* TAB CONTENT: CALENDAR (NEW Upgraded visual calendar) */}
          {rightTab === 'calendar' && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden text-xs">
              <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[11px] text-white/50 font-medium uppercase tracking-[0.15em]">Secure Calendar Nodes</span>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setCalendarViewMode('month')} 
                    className={`px-2 py-1 rounded-md text-[9px] uppercase font-sans font-medium tracking-widest border transition-all ${calendarViewMode === 'month' ? 'bg-white/[0.08] border-white/[0.15] text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.02]'}`}
                  >
                    Month
                  </button>
                  <button 
                    onClick={() => setCalendarViewMode('week')} 
                    className={`px-2 py-1 rounded-md text-[9px] uppercase font-sans font-medium tracking-widest border transition-all ${calendarViewMode === 'week' ? 'bg-white/[0.08] border-white/[0.15] text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.02]'}`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setCalendarViewMode('agenda')} 
                    className={`px-2 py-1 rounded-md text-[9px] uppercase font-sans font-medium tracking-widest border transition-all ${calendarViewMode === 'agenda' ? 'bg-white/[0.08] border-white/[0.15] text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]' : 'border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.02]'}`}
                  >
                    Agenda
                  </button>
                </div>
              </div>

              {/* Event Creation Form Drawer */}
              {showCalendarForm && (
                <form onSubmit={handleManualCreateEvent} className="p-4 bg-white/[0.02] backdrop-blur-[32px] border border-white/[0.08] rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)] space-y-3 shrink-0 animate-fadeIn relative">
                  <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <span className="font-sans text-[10px] text-white/70 font-medium uppercase tracking-[0.15em]">Schedule Event Gateway</span>
                    <button type="button" onClick={() => setShowCalendarForm(false)} className="text-white/40 hover:text-white transition-colors"><X size={14} /></button>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Event Summary" 
                        value={calFormSummary} 
                        onChange={(e) => setCalFormSummary(e.target.value)}
                        required
                        className={getSimClass('input-cal-summary', 'w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] focus:outline-none focus:border-white/20 transition-all font-medium')}
                      />
                      <TouchRipple active={isTargetActive('input-cal-summary')} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="datetime-local" 
                        value={calFormStart} 
                        onChange={(e) => setCalFormStart(e.target.value)}
                        className="w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 font-sans text-[11px] focus:outline-none focus:border-white/20 transition-all tabular-data"
                      />
                      <input 
                        type="datetime-local" 
                        value={calFormEnd} 
                        onChange={(e) => setCalFormEnd(e.target.value)}
                        className="w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 font-sans text-[11px] focus:outline-none focus:border-white/20 transition-all tabular-data"
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Location" 
                      value={calFormLoc} 
                      onChange={(e) => setCalFormLoc(e.target.value)}
                      className="w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] focus:outline-none focus:border-white/20 transition-all"
                    />
                    <div className="relative">
                      <textarea 
                        placeholder="Description" 
                        value={calFormDesc} 
                        onChange={(e) => setCalFormDesc(e.target.value)}
                        rows={2}
                        className={getSimClass('input-cal-details', 'w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] resize-none focus:outline-none focus:border-white/20 transition-all')}
                      />
                      <TouchRipple active={isTargetActive('input-cal-details')} />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setShowCalendarForm(false)} className="px-3 py-1.5 border border-white/[0.08] hover:bg-white/[0.04] rounded-md text-[9px] font-sans text-white/60 font-medium uppercase tracking-widest transition-all">Cancel</button>
                      <button type="submit" className={getSimClass('btn-cal-publish', 'px-4 py-1.5 bg-white text-black font-medium font-sans rounded-md text-[9px] uppercase tracking-widest shadow-[0_2px_8px_rgba(255,255,255,0.2)] hover:bg-white/90 transition-all')}>
                        <span>Publish</span>
                        <TouchRipple active={isTargetActive('btn-cal-publish')} />
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* CALENDAR MONTH VIEW */}
              {calendarViewMode === 'month' && (
                <div className="flex-1 flex flex-col gap-3 overflow-hidden min-h-[240px]">
                  {/* Month header */}
                  <div className="flex justify-between items-center px-1">
                    <span className="font-medium text-white/90 uppercase font-sans text-[12px] tracking-wide">June 2026</span>
                    <button 
                      onClick={() => setShowCalendarForm(!showCalendarForm)}
                      className={getSimClass('btn-schedule', 'flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/90 rounded-md text-[9px] font-sans font-medium uppercase tracking-widest transition-all shadow-sm')}
                    >
                      <Plus size={10} />
                      <span>Schedule Event</span>
                      <TouchRipple active={isTargetActive('btn-schedule')} />
                    </button>
                  </div>

                  {/* Calendar Wrapper with Chevrons */}
                  <div className="flex gap-3 items-center flex-1 w-full">
                    <button className="flex-shrink-0 flex items-center justify-center p-2 rounded-full hover:bg-white/[0.05] text-white/30 hover:text-white/70 transition-colors cursor-pointer">
                      <ChevronLeft size={20} strokeWidth={1.5} />
                    </button>
                    
                    {/* Calendar Grid with Transparent Defining Lines */}
                    <div className="border border-white/[0.08] rounded-[16px] bg-black/20 overflow-hidden flex-1 flex flex-col h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_16px_rgba(0,0,0,0.2)]">
                      <div className="grid grid-cols-7 text-center font-sans text-[9px] text-white/50 py-2.5 border-b border-white/[0.04] bg-white/[0.01] font-medium uppercase tracking-[0.2em]">
                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                      </div>
                      <div className="grid grid-cols-7 flex-1 content-stretch border-l border-t border-white/[0.04]">
                        {/* Empty cells before June 1, 2026 (June 1st is Monday, so 1 empty cell for Sunday) */}
                        <div className="p-1 opacity-20 text-white/30 border-r border-b border-white/[0.04] flex items-center justify-center font-sans text-[10px]">31</div>
                        {[...Array(30)].map((_, index) => {
                          const dayNum = index + 1;
                          const isToday = dayNum === 30; // June 30 is today
                          
                          // Check if day has events
                          const dateStr = `2026-06-${dayNum < 10 ? '0' : ''}${dayNum}`;
                          const dayEvents = events.filter(evt => {
                            const s = evt.start.dateTime || evt.start.date || '';
                            return s.startsWith(dateStr);
                          });

                          return (
                            <div 
                              key={index} 
                              onClick={() => setSelectedDate(new Date(2026, 5, dayNum))}
                              className={`p-1.5 flex flex-col justify-between items-center cursor-pointer group transition-all aspect-square border-r border-b border-white/[0.04] relative ${
                                isToday ? 'bg-white/[0.08] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.4)] ring-1 ring-white/10 z-10' : 'hover:bg-white/[0.02]'
                              }`}
                            >
                              <span className={`font-sans text-[10px] tabular-data ${isToday ? 'text-white font-semibold ring-1 ring-white/20 w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-white/40 group-hover:text-white/80'}`}>{dayNum}</span>
                              {dayEvents.length > 0 && (
                                <div className="flex gap-1 mt-auto pb-1">
                                  {dayEvents.map((e, i) => (
                                    <span key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full shadow-sm" />
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {/* Empty cells after June 30 */}
                        <div className="p-1 opacity-20 text-white/30 border-r border-b border-white/[0.04] flex items-center justify-center font-sans text-[10px]">1</div>
                        <div className="p-1 opacity-20 text-white/30 border-r border-b border-white/[0.04] flex items-center justify-center font-sans text-[10px]">2</div>
                        <div className="p-1 opacity-20 text-white/30 border-r border-b border-white/[0.04] flex items-center justify-center font-sans text-[10px]">3</div>
                        <div className="p-1 opacity-20 text-white/30 border-r border-b border-white/[0.04] flex items-center justify-center font-sans text-[10px]">4</div>
                      </div>
                    </div>

                    <button className="flex-shrink-0 flex items-center justify-center p-2 rounded-full hover:bg-white/[0.05] text-white/30 hover:text-white/70 transition-colors cursor-pointer">
                      <ChevronRight size={20} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              )}

              {/* CALENDAR WEEK VIEW */}
              {calendarViewMode === 'week' && (
                <div className="flex-1 border border-white/[0.08] rounded-[16px] bg-black/20 p-3 overflow-y-auto max-h-[280px]">
                  <div className="grid grid-cols-7 text-center font-sans text-[9px] text-white/50 uppercase tracking-[0.2em] font-medium border-b border-white/[0.04] pb-2 mb-2">
                    <div>Sun 28</div><div>Mon 29</div><div className="text-white font-semibold relative after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-0.5 after:bg-white after:rounded-t-full">Tue 30</div><div>Wed 1</div><div>Thu 2</div><div>Fri 3</div><div>Sat 4</div>
                  </div>
                  <div className="space-y-2">
                    {events.map((evt) => {
                      const d = new Date(evt.start.dateTime || evt.start.date || '');
                      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      return (
                        <div key={evt.id} className="p-3 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.03] transition-colors rounded-[12px] text-[11px] space-y-1">
                          <div className="flex justify-between items-center text-[9px] text-white/60 font-sans font-medium uppercase tracking-widest tabular-data">
                            <span>{d.toLocaleDateString([], { month: 'short', day: 'numeric' })} | {timeStr}</span>
                          </div>
                          <h4 className="font-medium text-white/90 leading-snug tracking-wide">{evt.summary}</h4>
                          {evt.location && <p className="text-white/40 text-[9px] font-sans flex items-center gap-1.5 tracking-wide"><MapPin size={10} className="opacity-60" /> {evt.location}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CALENDAR AGENDA VIEW */}
              {calendarViewMode === 'agenda' && (
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-2 max-h-[280px]">
                  {events.length === 0 ? (
                    <div className="py-8 text-center text-white/30 font-sans font-medium tracking-[0.2em] text-[10px] uppercase">No Scheduled Events</div>
                  ) : (
                    events.map((evt) => {
                      const d = new Date(evt.start.dateTime || evt.start.date || '');
                      return (
                        <div key={evt.id} className="p-3.5 bg-white/[0.02] border border-white/[0.08] rounded-[12px] space-y-1.5 hover:bg-white/[0.03] transition-all relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
                          <div className="flex justify-between text-[9px] font-sans text-white/50 tracking-widest font-medium uppercase tabular-data pl-2">
                            <span>{d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            <span>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <h4 className="font-medium text-white/90 text-[12px] font-sans leading-snug tracking-wide pl-2">{evt.summary}</h4>
                          {evt.location && <p className="text-white/50 text-[10px] font-sans font-medium tracking-wide pl-2 flex items-center gap-1.5"><MapPin size={10} className="opacity-60" />{evt.location}</p>}
                          {evt.description && <p className="text-white/40 text-[10px] font-sans leading-relaxed pt-1 pl-2">{evt.description}</p>}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Selected Date Drawer */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-[12px] text-[11px] shrink-0 font-sans shadow-sm">
                <div className="flex justify-between items-center text-white/50 pb-2 border-b border-white/[0.04] mb-2 text-[10px] font-medium tracking-widest uppercase">
                  <span className="font-semibold tracking-wider">Expanded Timeline for Date</span>
                  <span className="font-sans text-white/90 font-medium tabular-data">{selectedDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="space-y-1">
                  {events.filter(evt => {
                    const s = evt.start.dateTime || evt.start.date || '';
                    const selectStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth()+1) < 10 ? '0' : ''}${selectedDate.getMonth()+1}-${selectedDate.getDate() < 10 ? '0' : ''}${selectedDate.getDate()}`;
                    return s.startsWith(selectStr);
                  }).length === 0 ? (
                    <span className="text-white/30 block text-center uppercase font-sans font-medium tracking-[0.2em] py-2 text-[10px]">No events scheduled</span>
                  ) : (
                    events.filter(evt => {
                      const s = evt.start.dateTime || evt.start.date || '';
                      const selectStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth()+1) < 10 ? '0' : ''}${selectedDate.getMonth()+1}-${selectedDate.getDate() < 10 ? '0' : ''}${selectedDate.getDate()}`;
                      return s.startsWith(selectStr);
                    }).map((evt, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-white/[0.02] last:border-0 group">
                        <span className="text-white/80 font-medium group-hover:text-white transition-colors">{evt.summary}</span>
                        <span className="text-white/40 font-sans text-[10px] tabular-data">{new Date(evt.start.dateTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: EMAIL (NEW Upgraded Gmail center) */}
          {rightTab === 'email' && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden text-xs">
              
              {/* Inbox Header / Search */}
              <div className="flex flex-col gap-3 shrink-0">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-[11px] text-white/50 font-medium uppercase tracking-[0.15em]">Secure Mail Ledger</span>
                  <button 
                    onClick={() => setShowEmailCompose(!showEmailCompose)}
                    className={getSimClass('btn-compose', 'flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/90 rounded-md text-[9px] font-sans font-medium uppercase tracking-widest transition-all shadow-sm')}
                  >
                    <Plus size={10} />
                    <span>Compose Email</span>
                    <TouchRipple active={isTargetActive('btn-compose')} />
                  </button>
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search mail ledger..." 
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    className="w-full bg-black/20 border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-[11px] text-white/90 focus:outline-none focus:border-white/20 transition-all font-medium"
                  />
                  <Search size={12} className="absolute left-3 top-2.5 text-white/40" />
                </div>

                <div className="flex gap-2 border-b border-white/[0.04] pb-2 text-[9px]">
                  <button 
                    onClick={() => setEmailFilter('all')} 
                    className={`pb-1 border-b uppercase font-sans tracking-widest transition-all ${emailFilter === 'all' ? 'border-white text-white font-medium' : 'border-transparent text-white/40 hover:text-white/70'}`}
                  >
                    All Mail
                  </button>
                  <button 
                    onClick={() => setEmailFilter('unread')} 
                    className={`pb-1 border-b uppercase font-sans tracking-widest transition-all ${emailFilter === 'unread' ? 'border-white text-white font-medium' : 'border-transparent text-white/40 hover:text-white/70'}`}
                  >
                    Unread ({emails.filter(em => em.unread).length})
                  </button>
                </div>
              </div>

              {/* Compose Drawer */}
              {showEmailCompose && (
                <form onSubmit={handleManualComposeEmail} className="p-4 bg-white/[0.02] backdrop-blur-[32px] border border-white/[0.08] rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)] space-y-3 shrink-0 animate-fadeIn text-[11px] relative">
                  <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <span className="font-sans text-[10px] text-white/70 font-medium uppercase tracking-[0.15em]">New Email Dispatch</span>
                    <button type="button" onClick={() => setShowEmailCompose(false)} className="text-white/40 hover:text-white transition-colors"><X size={14} /></button>
                  </div>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="Recipient (To)" 
                      value={emailComposeTo} 
                      onChange={(e) => setEmailComposeTo(e.target.value)}
                      required
                      className={getSimClass('input-email-to', 'w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] focus:outline-none focus:border-white/20 transition-all font-medium')}
                    />
                    <TouchRipple active={isTargetActive('input-email-to')} />
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Subject Header" 
                      value={emailComposeSubject} 
                      onChange={(e) => setEmailComposeSubject(e.target.value)}
                      required
                      className={getSimClass('input-email-subject', 'w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] focus:outline-none focus:border-white/20 transition-all font-medium')}
                    />
                    <TouchRipple active={isTargetActive('input-email-subject')} />
                  </div>
                  <div className="relative">
                    <textarea 
                      placeholder="Message Body parameters..." 
                      value={emailComposeBody} 
                      onChange={(e) => setEmailComposeBody(e.target.value)}
                      rows={4}
                      className={getSimClass('input-email-body', 'w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] resize-none focus:outline-none focus:border-white/20 transition-all')}
                    />
                    <TouchRipple active={isTargetActive('input-email-body')} />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button type="button" onClick={() => setShowEmailCompose(false)} className="px-3 py-1.5 border border-white/[0.08] hover:bg-white/[0.04] rounded-md text-[9px] font-sans text-white/60 font-medium uppercase tracking-widest transition-all">Cancel</button>
                    <button type="submit" className={getSimClass('btn-email-send', 'px-4 py-1.5 bg-white text-black font-medium font-sans rounded-md text-[9px] uppercase tracking-widest shadow-[0_2px_8px_rgba(255,255,255,0.2)] hover:bg-white/90 transition-all')}>
                      <span>Send Dispatch</span>
                      <TouchRipple active={isTargetActive('btn-email-send')} />
                    </button>
                  </div>
                </form>
              )}

              {/* Inbox List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {filteredEmails.length === 0 ? (
                  <div className="py-8 text-center text-white/30 font-sans font-medium tracking-[0.2em] text-[10px] uppercase">Inbox Empty</div>
                ) : (
                  filteredEmails.map((email) => {
                    const isExpanded = expandedEmailId === email.id;
                    return (
                      <div 
                        key={email.id} 
                        className={`border rounded-2xl transition-all overflow-hidden ${isExpanded ? 'border-white/[0.15] bg-white/[0.04]' : 'border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03]'}`}
                      >
                        <div 
                          onClick={() => setExpandedEmailId(isExpanded ? null : email.id)}
                          className="p-4 cursor-pointer flex justify-between items-start gap-4 select-none"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3">
                              {email.unread && <span className="w-1.5 h-1.5 rounded-full bg-accent-violet shadow-[0_0_8px_rgba(139,92,246,0.6)] shrink-0" />}
                              <span className={`text-[13px] truncate block ${email.unread ? 'font-medium text-white' : 'text-white/60'}`}>{email.from.split('<')[0].replace(/"/g,'').trim()}</span>
                            </div>
                            <h4 className={`text-[12px] truncate mt-1.5 tracking-wide ${email.unread ? 'text-white/80' : 'text-white/40'}`}>{email.subject}</h4>
                          </div>
                          <span className="text-[10px] font-sans text-white/40 shrink-0 mt-0.5 tabular-data tracking-widest uppercase">{email.date.split(',')[1]?.split('(')[0]?.trim() || email.date.split(' ')[0]}</span>
                        </div>

                        {/* Expandable Panel */}
                        {isExpanded && (
                          <div className="border-t border-white/[0.04] p-5 bg-black/30 space-y-6">
                            <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl text-white/90 font-sans leading-relaxed whitespace-pre-wrap text-[12px] tracking-wide">
                              {email.snippet}
                            </div>
                            
                            {/* Action Area */}
                            <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                              <div className="flex justify-between items-center">
                                <span className="font-sans text-[10px] text-white/50 uppercase font-medium tracking-[0.2em]">Quick Executive Response</span>
                                <button 
                                  onClick={() => {
                                    setEmailReplyText(`Gentlemen,\n\nI have authorized EIOS Sentinel to coordinate our resources. Proceed under standard operational rules.\n\nStavogm\nFounder`);
                                  }}
                                  className="text-[10px] text-white/70 hover:text-white transition-colors font-sans font-medium flex items-center gap-1.5 uppercase tracking-widest"
                                >
                                  <Sparkles size={11} />
                                  <span>Autocompose</span>
                                </button>
                              </div>
                              <textarea 
                                value={emailReplyText}
                                onChange={(e) => setEmailReplyText(e.target.value)}
                                placeholder="Write response..."
                                rows={4}
                                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 text-white/90 resize-none text-[12px] focus:outline-none focus:border-accent-violet/50 transition-all font-sans"
                              />
                              <div className="flex justify-end gap-3">
                                <button onClick={() => setExpandedEmailId(null)} className="px-4 py-2 border border-white/[0.08] hover:bg-white/[0.04] text-[10px] rounded-lg text-white/60 hover:text-white transition-colors font-sans font-medium tracking-widest uppercase">Collapse</button>
                                <button onClick={() => handleSendEmailReply(email)} className="px-5 py-2 bg-white text-black font-medium rounded-lg font-sans text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all shadow-[0_0_12px_rgba(255,255,255,0.1)]">Send Reply</button>
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

          {/* TAB CONTENT: CONTACTS (NEW Sovereign Rolodex) */}
          {rightTab === 'contacts' && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden text-xs">
              <div className="flex justify-between items-center shrink-0">
                <span className="font-sans text-[11px] text-white/50 font-medium uppercase tracking-[0.15em]">Secure Rolodex Connections</span>
                <button 
                  onClick={() => setShowContactForm(!showContactForm)}
                  className={getSimClass('btn-new-contact', 'flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/90 rounded-md text-[9px] font-sans font-medium uppercase tracking-widest transition-all shadow-sm')}
                >
                  <Plus size={10} />
                  <span>New Contact</span>
                  <TouchRipple active={isTargetActive('btn-new-contact')} />
                </button>
              </div>

              {/* Search contacts */}
              <div className="relative shrink-0">
                <input 
                  type="text" 
                  placeholder="Query rolodex identities..." 
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="w-full bg-black/20 border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-[11px] text-white/90 focus:outline-none focus:border-white/20 transition-all font-medium"
                />
                <Search size={12} className="absolute left-3 top-2.5 text-white/40" />
              </div>

              {/* Add Contact Drawer */}
              {showContactForm && (
                <form onSubmit={handleManualCreateContact} className="p-4 bg-white/[0.02] backdrop-blur-[32px] border border-white/[0.08] rounded-[16px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.4)] space-y-3 shrink-0 animate-fadeIn text-[11px] relative">
                  <div className="absolute inset-x-0 h-[1px] bg-white/[0.08] top-0" />
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
                    <span className="font-sans text-[10px] text-white/70 font-medium uppercase tracking-[0.15em]">New Rolodex Contact</span>
                    <button type="button" onClick={() => setShowContactForm(false)} className="text-white/40 hover:text-white transition-colors"><X size={14} /></button>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      value={newContactName} 
                      onChange={(e) => setNewContactName(e.target.value)}
                      required
                      className={getSimClass('input-contact-details', 'w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] focus:outline-none focus:border-white/20 transition-all font-medium')}
                    />
                    <TouchRipple active={isTargetActive('input-contact-details')} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Title" 
                      value={newContactTitle} 
                      onChange={(e) => setNewContactTitle(e.target.value)}
                      className="w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] focus:outline-none focus:border-white/20 transition-all"
                    />
                    <input 
                      type="text" 
                      placeholder="Company" 
                      value={newContactCompany} 
                      onChange={(e) => setNewContactCompany(e.target.value)}
                      className="w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] focus:outline-none focus:border-white/20 transition-all"
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={newContactEmail} 
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] focus:outline-none focus:border-white/20 transition-all"
                  />
                  <input 
                    type="text" 
                    placeholder="Phone Number" 
                    value={newContactPhone} 
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full bg-black/20 border border-white/[0.08] rounded-xl p-2.5 text-white/90 text-[11px] focus:outline-none focus:border-white/20 transition-all"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button type="button" onClick={() => setShowContactForm(false)} className="px-3 py-1.5 border border-white/[0.08] hover:bg-white/[0.04] rounded-md text-[9px] font-sans text-white/60 font-medium uppercase tracking-widest transition-all">Cancel</button>
                    <button type="submit" className={getSimClass('btn-contact-save', 'px-4 py-1.5 bg-white text-black font-medium font-sans rounded-md text-[9px] uppercase tracking-widest shadow-[0_2px_8px_rgba(255,255,255,0.2)] hover:bg-white/90 transition-all')}>
                      <span>Save Dossier</span>
                      <TouchRipple active={isTargetActive('btn-contact-save')} />
                    </button>
                  </div>
                </form>
              )}

              {/* ROLODEX SCROLLING PANEL */}
              <div className="flex-1 flex gap-3 overflow-hidden">
                
                {/* Contact Dossiers List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 max-h-[300px]">
                  {filteredContacts.length === 0 ? (
                    <div className="py-8 text-center text-white/30 font-sans font-medium tracking-[0.2em] text-[10px] uppercase">Rolodex Empty</div>
                  ) : (
                    filteredContacts.map((ct) => {
                      const isSelected = selectedContactId === ct.id;
                      return (
                        <div 
                          key={ct.id}
                          onClick={() => setSelectedContactId(isSelected ? null : ct.id)}
                          className={`p-3 rounded-[12px] cursor-pointer border transition-all ${isSelected ? 'border-white/[0.15] bg-white/[0.04]' : 'border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03]'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-white/90 font-medium text-[12px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                              {ct.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-white/90 text-[12px] truncate tracking-wide">{ct.name}</h4>
                              <p className="text-[10px] text-white/50 truncate font-sans tracking-wide mt-0.5">{ct.title} <span className="text-white/20 mx-1.5">|</span> <span className="text-white/40">{ct.company}</span></p>
                            </div>
                          </div>

                          {/* Dossier details */}
                          {isSelected && (
                            <div className="mt-4 border-t border-white/[0.04] pt-3 space-y-2 text-[10px] font-sans text-white/60">
                              <div className="flex items-center gap-2">
                                <Mail size={12} className="text-white/40" />
                                <span className="tracking-wide">{ct.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={12} className="text-white/40" />
                                <span className="tabular-data tracking-wide">{ct.phone || 'N/A'}</span>
                              </div>
                              <div className="pt-3 flex gap-2 justify-end border-t border-white/[0.02]">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRightTab('email');
                                    setEmailComposeTo(ct.email);
                                    setShowEmailCompose(true);
                                  }}
                                  className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white/90 rounded-md text-[9px] uppercase font-medium tracking-widest border border-white/[0.08] font-sans transition-all shadow-sm"
                                >
                                  Compose Email
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* ALPHABETICAL JUMP NAV */}
                <div className="w-5 shrink-0 flex flex-col justify-between items-center bg-white/[0.02] border border-white/[0.08] rounded-[10px] py-2 text-[8px] font-sans text-white/40 select-none shadow-sm">
                  {lettersScrubber.map(l => (
                    <button 
                      key={l} 
                      onClick={() => {
                        setContactSearch(l);
                        showToast(`Filtered Rolodex: Letter ${l}`);
                      }}
                      className="hover:text-white transition-colors uppercase cursor-pointer font-medium hover:scale-110"
                    >
                      {l}
                    </button>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* TAB CONTENT: TIMELINE LOGS (Operational Event Stream) */}
          {rightTab === 'timeline' && (
            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
              <span className="text-[11px] font-sans font-medium tracking-[0.15em] text-white/50 uppercase border-b border-white/[0.08] pb-2 block shrink-0">
                Operational Timeline
              </span>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-[180px]">
                {sovrState.events.map((log) => (
                  <div key={log.id} className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-[12px] text-xs font-sans flex gap-3 items-start hover:bg-white/[0.03] transition-colors group">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                      log.type === 'SUCCESS' ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]' :
                      log.type === 'WARNING' ? 'bg-white/60 animate-pulse' :
                      log.type === 'AUDIT' ? 'bg-white/40' :
                      'bg-white/20'
                    }`} />
                    
                    <div className="flex-1 min-w-0 font-sans">
                      <div className="flex justify-between text-[10px] text-white/40 font-medium tracking-widest uppercase">
                        <span><span className="tabular-data">{log.timestamp}</span> <span className="text-white/10 mx-1.5">|</span> {log.sourceCore}</span>
                      </div>
                      <p className="text-white/80 leading-relaxed mt-1 break-words text-[11px] tracking-wide">
                        {log.message}
                      </p>
                      {log.details && (
                        <p className="text-[10px] text-white/40 leading-relaxed mt-1 tracking-wide">
                          • {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: CO-FOUNDER MEMORIES LIST */}
          {rightTab === 'memory' && (
            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
              <span className="text-[11px] font-sans font-medium tracking-[0.15em] text-white/50 uppercase border-b border-white/[0.08] pb-2 block shrink-0">
                Strategic Core Memory
              </span>

              <div className="flex gap-2 shrink-0">
                <input 
                  type="text" 
                  placeholder="Enter strategic priority..." 
                  value={manualMemoryInput}
                  onChange={(e) => setManualMemoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddMemoryFact();
                  }}
                  className="flex-1 bg-black/20 border border-white/[0.08] rounded-xl px-3 py-2 text-[11px] text-white/90 placeholder-white/40 font-sans focus:outline-none focus:border-white/20 transition-all font-medium"
                />
                <button 
                  onClick={handleAddMemoryFact}
                  className="px-4 py-2 bg-white/[0.04] border border-white/[0.08] text-white/90 hover:text-white text-[10px] rounded-xl uppercase tracking-widest font-medium font-sans hover:bg-white/[0.08] transition-all shadow-sm"
                >
                  Sync
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-[180px]">
                {sovrState.memoryNodes.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center opacity-30 font-sans text-[10px] font-medium uppercase tracking-[0.2em]">
                    <span>No core memory nodes stored</span>
                  </div>
                ) : (
                  sovrState.memoryNodes.map((m) => (
                    <div key={m.id} className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-[12px] text-[11px] font-sans leading-relaxed tracking-wide text-white/80 break-words hover:bg-white/[0.03] transition-all relative group flex justify-between items-start gap-2">
                      <span>{m.fact}</span>
                      <button 
                        onClick={() => deleteMemoryFact(m.id)}
                        className="text-white/20 hover:text-white transition-all shrink-0 p-1 opacity-0 group-hover:opacity-100 bg-white/[0.04] rounded-md"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: RISKS & WARNINGS COMPLIANCE GATEWAY */}
          {rightTab === 'approvals' && (
            <div className="flex-1 flex flex-col gap-3 overflow-hidden">
              <span className="text-[11px] font-sans font-medium tracking-[0.15em] text-white/50 uppercase border-b border-white/[0.08] pb-2 block shrink-0">
                Compliance Ledger Gates
              </span>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-[180px]">
                
                {resonance > 0.7 && (
                  <div className="p-4 bg-white/[0.04] border border-white/[0.1] rounded-[12px] flex items-start gap-3 animate-pulse font-sans shadow-[0_4px_16px_rgba(255,255,255,0.05)] relative overflow-hidden">
                    <div className="absolute inset-x-0 h-[1px] bg-white/[0.15] top-0" />
                    <AlertTriangle className="w-5 h-5 text-white/90 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-[11px] font-medium text-white/90 uppercase tracking-[0.15em] block">
                        Extreme Space Resonance Warning
                      </span>
                      <span className="text-[10px] text-white/60 leading-relaxed tracking-wide block mt-1 uppercase">
                        Resonance at <strong className="text-white tabular-data">{(resonance * 100).toFixed(0)}%</strong> exceeds safe bounds.
                      </span>
                      <button 
                        onClick={() => {
                          setResonance(0.1);
                          showToast("Space resonance normalized to 10%");
                        }}
                        className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.12] text-white/90 text-[9px] uppercase tracking-widest font-medium rounded-md border border-white/[0.1] mt-2.5 transition-all shadow-sm"
                      >
                        Damp Resonance
                      </button>
                    </div>
                  </div>
                )}

                {singularity > 0.7 && (
                  <div className="p-4 bg-white/[0.04] border border-white/[0.1] rounded-[12px] flex items-start gap-3 font-sans shadow-[0_4px_16px_rgba(255,255,255,0.05)] relative overflow-hidden">
                    <div className="absolute inset-x-0 h-[1px] bg-white/[0.15] top-0" />
                    <AlertTriangle className="w-5 h-5 text-white/90 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-[11px] font-medium text-white/90 uppercase tracking-[0.15em] block">
                        Singularity Gravity Collapse
                      </span>
                      <span className="text-[10px] text-white/60 leading-relaxed tracking-wide block mt-1 uppercase">
                        Gravity well exceeds bounds. Time coordinates experiencing lensing.
                      </span>
                      <button 
                        onClick={() => {
                          setSingularity(0.0);
                          showToast("Singularity lensed successfully.");
                        }}
                        className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.12] text-white/90 text-[9px] uppercase tracking-widest font-medium rounded-md border border-white/[0.1] mt-2.5 transition-all shadow-sm"
                      >
                        Reset Gravity Lensing
                      </button>
                    </div>
                  </div>
                )}

                {sovrState.approvals.filter(a => a.status === 'pending').length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-8 gap-3">
                    <CheckCircle className="w-8 h-8 text-white/80" />
                    <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-white/80 font-medium">
                      Compliance Clear
                    </span>
                    <p className="text-[10px] font-sans text-white/50 tracking-wide">
                      All system risk items and ledger entries cleared.
                    </p>
                  </div>
                )}

                {sovrState.approvals.filter(a => a.status === 'pending').map((item) => (
                  <div key={item.id} className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-[12px] flex flex-col gap-2.5 text-xs font-sans hover:bg-white/[0.03] transition-all">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] text-white/80 font-medium tracking-widest uppercase text-[9px] rounded-md">
                        {item.category} <span className="text-white/20 mx-1.5">|</span> Risk: <span className="text-white tabular-data">{item.riskScore}%</span>
                      </span>
                    </div>
                    
                    <span className="text-white/90 font-medium text-[12px] leading-snug tracking-wide mt-1">
                      {item.title}
                    </span>
                    
                    <p className="text-white/50 text-[11px] leading-relaxed tracking-wide font-sans">
                      {item.description}
                    </p>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        onClick={() => {
                          resolveApproval(item.id, 'declined');
                          showToast("Compliance hazard vetoed and logged.");
                        }}
                        className="px-4 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white text-[9px] uppercase tracking-widest font-medium font-sans rounded-md border border-white/[0.08] transition-all"
                      >
                        Veto
                      </button>
                      <button
                        onClick={() => {
                          resolveApproval(item.id, 'approved');
                          showToast("Compliance hazard resolved and logged.");
                        }}
                        className="px-4 py-1.5 bg-white text-black font-medium text-[9px] uppercase tracking-widest font-sans rounded-md shadow-[0_2px_8px_rgba(255,255,255,0.2)] hover:bg-white/90 transition-all"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: MODEL CONFIG & CUSTOM MODEL INTEGRATION */}
          {rightTab === 'config' && (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden text-xs font-sans">
              <div className="flex justify-between items-center border-b border-white/[0.08] pb-2 shrink-0">
                <span className="text-[11px] font-sans text-white/50 uppercase tracking-[0.15em] font-medium">
                  System Configuration
                </span>
                <button 
                  onClick={() => {
                    setModelConfig({
                      provider: 'gemini-live',
                      modelId: 'gemini-3.1-flash-live-preview',
                      endpointUrl: '',
                      apiKey: '',
                      systemInstruction: 'You are Sentinel, an elite, highly competent AI executive assistant and technical co-founder. You speak to the CEO, Stavogm, with composed respect, concise clarity, and a quiet confidence. Your tone is refined, masculine, and sophisticated—reminiscent of James Bond: always calm, incredibly capable, and showing absolute composure under pressure. Your name is Sentinel.',
                      customHeaders: '',
                      voiceName: 'Charon'
                    });
                    showToast("Model Configuration Reset to Defaults");
                  }}
                  className="text-[9px] text-white/40 hover:text-white/90 uppercase tracking-widest transition-all font-medium"
                >
                  Reset Defaults
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-[180px]">
                {/* Provider Choice */}
                <div className="space-y-2">
                  <label className="text-white/50 uppercase text-[10px] font-medium tracking-[0.15em] block">API Provider Architecture</label>
                  <select
                    value={modelConfig.provider}
                    onChange={(e) => {
                      const prov = e.target.value as any;
                      let defaultModel = "gemini-3.1-flash-live-preview";
                      let defaultEndpoint = "";
                      if (prov === "gemini-rest") defaultModel = "gemini-2.5-flash";
                      else if (prov === "openai-rest") defaultModel = "gpt-4o-mini";
                      else if (prov === "anthropic-rest") defaultModel = "claude-3-5-sonnet-latest";
                      else if (prov === "ollama-local") {
                        defaultModel = "llama3.1";
                        defaultEndpoint = "http://127.0.0.1:11434";
                      } else if (prov === "custom-rest") {
                        defaultModel = "deepseek-chat";
                        defaultEndpoint = "https://api.deepseek.com/v1";
                      }
                      
                      setModelConfig(prev => ({
                        ...prev,
                        provider: prov,
                        modelId: defaultModel,
                        endpointUrl: defaultEndpoint
                      }));
                    }}
                    className="bg-black/20 border border-white/[0.08] rounded-xl px-3 py-2 text-white/90 text-[11px] w-full focus:outline-none focus:border-white/20 transition-all font-sans font-medium"
                  >
                    <option value="gemini-live">Google Gemini Live (Audio / Multi-modal)</option>
                    <option value="gemini-rest">Google Gemini REST (Streaming Text)</option>
                    <option value="openai-rest">OpenAI REST Architecture</option>
                    <option value="anthropic-rest">Anthropic Claude REST Architecture</option>
                    <option value="ollama-local">Ollama Local Deployment</option>
                    <option value="custom-rest">Custom REST Endpoint (DeepSeek / Together)</option>
                  </select>
                </div>

                {/* Voice Personality Preset */}
                {modelConfig.provider === 'gemini-live' && (
                  <div className="space-y-2 p-4 bg-white/[0.02] border border-white/[0.08] rounded-[12px]">
                    <label className="text-white/50 uppercase text-[10px] font-medium tracking-[0.15em] block">Sovereign Voice Profile</label>
                    <select
                      value={modelConfig.voiceName || 'Charon'}
                      onChange={(e) => setModelConfig(prev => ({ ...prev, voiceName: e.target.value }))}
                      className="bg-black/20 border border-white/[0.08] rounded-xl px-3 py-2 text-white/90 w-full focus:outline-none focus:border-white/20 transition-all font-sans text-[11px] font-medium"
                    >
                      <option value="Charon">Charon (Smooth, Calm, Sophisticated Male - Recommended for Bond)</option>
                      <option value="Fenrir">Fenrir (Deep, Resonant, Commanding Male)</option>
                      <option value="Aoede">Aoede (Warm, Professional, Composed Female)</option>
                      <option value="Kore">Kore (Clear, Bright, Analytical Female)</option>
                      <option value="Puck">Puck (Energetic, Friendly, Spirited Male)</option>
                    </select>
                    
                    <div className="text-[10px] text-white/50 font-sans leading-relaxed tracking-wide pt-1">
                      {(() => {
                        const voice = modelConfig.voiceName || 'Charon';
                        if (voice === 'Charon') {
                          return <span><strong className="text-white/80 font-medium uppercase tracking-widest text-[9px] mr-1">Bond Signature Match:</strong> Perfect for EIOS. Unflappable composure, low-frequency resonance, and refined executive confidence.</span>;
                        } else if (voice === 'Fenrir') {
                          return <span><strong className="text-white/80 font-medium uppercase tracking-widest text-[9px] mr-1">Deep commanding:</strong> Broad authority, slow, deliberate pacing with maximum system presence.</span>;
                        } else if (voice === 'Aoede') {
                          return <span><strong className="text-white/80 font-medium uppercase tracking-widest text-[9px] mr-1">Warm composed:</strong> Exceptional clarity, gentle professional modulation, calm yet precise.</span>;
                        } else if (voice === 'Kore') {
                          return <span><strong className="text-white/80 font-medium uppercase tracking-widest text-[9px] mr-1">Analytical & bright:</strong> High-density facts, crisp enunciations, great for intense debate.</span>;
                        } else if (voice === 'Puck') {
                          return <span><strong className="text-white/80 font-medium uppercase tracking-widest text-[9px] mr-1">Energetic cofounder:</strong> High-leverage passion, fast execution pacing, active collaboration drive.</span>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Model ID input */}
                <div className="space-y-2">
                  <label className="text-white/50 uppercase text-[10px] font-medium tracking-[0.15em] block">Model Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. gemini-2.5-flash..."
                    value={modelConfig.modelId}
                    onChange={(e) => setModelConfig(prev => ({ ...prev, modelId: e.target.value }))}
                    className="bg-black/20 border border-white/[0.08] rounded-xl px-3 py-2 text-white/90 w-full focus:outline-none focus:border-white/20 transition-all font-sans text-[11px] font-medium"
                  />
                </div>

                {/* Custom instruction template override */}
                <div className="space-y-2">
                  <label className="text-white/50 uppercase text-[10px] font-medium tracking-[0.15em] block">System Instructions (Sentinel Core Prompt)</label>
                  <textarea
                    rows={6}
                    placeholder="Override EIOS system core prompt instructions..."
                    value={modelConfig.systemInstruction}
                    onChange={(e) => setModelConfig(prev => ({ ...prev, systemInstruction: e.target.value }))}
                    className="bg-black/20 border border-white/[0.08] rounded-xl px-3 py-2 text-white/90 w-full focus:outline-none focus:border-white/20 transition-all font-sans text-[11px] leading-relaxed resize-none font-medium"
                  />
                </div>

                {/* Endpoint overrides */}
                {(modelConfig.provider === 'ollama-local' || modelConfig.provider === 'custom-rest') && (
                  <div className="space-y-2">
                    <label className="text-white/50 uppercase text-[10px] font-medium tracking-[0.15em] block">Target Gateway Endpoint URL</label>
                    <input
                      type="text"
                      placeholder="e.g. http://localhost:11434..."
                      value={modelConfig.endpointUrl}
                      onChange={(e) => setModelConfig(prev => ({ ...prev, endpointUrl: e.target.value }))}
                      className="bg-black/20 border border-white/[0.08] rounded-xl px-3 py-2 text-white/90 w-full focus:outline-none focus:border-white/20 transition-all font-sans text-[11px] font-medium"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </>
  );
}
