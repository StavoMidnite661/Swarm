import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Reuse existing app or initialize
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add all requested scopes
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/gmail.modify');
provider.addScope('https://www.googleapis.com/auth/contacts');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth listener
export const initAuthListener = (
  onAuthSuccess: (user: User, token: string) => void,
  onAuthFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken);
      } else {
        // If logged in but no token, we need to prompt login or wait
        // In many cases, we can check sessionStorage if we want to retain token for dev convenience,
        // but the prompt strictly says do NOT store token in localStorage or sessionStorage.
        // We will cache in-memory. If refreshed, the user can re-authenticate.
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure();
    }
  });
};

// Sign in flow
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (isSigningIn) return null;
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No access token returned from Google Auth provider.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sovereign Google OAuth Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Logout flow
export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Fetch Google Calendar Upcoming Events
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export const fetchUpcomingEvents = async (token: string): Promise<CalendarEvent[]> => {
  try {
    const timeMin = new Date().toISOString();
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&maxResults=10&orderBy=startTime&singleEvents=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Calendar fetch failed: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('fetchUpcomingEvents error:', error);
    throw error;
  }
};

// Create Calendar Event
export const createCalendarEvent = async (
  token: string,
  eventData: {
    summary: string;
    description?: string;
    location?: string;
    startDateTime: string;
    endDateTime: string;
  }
): Promise<CalendarEvent> => {
  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: eventData.summary,
          description: eventData.description,
          location: eventData.location,
          start: { dateTime: eventData.startDateTime },
          end: { dateTime: eventData.endDateTime },
        }),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Event creation failed: ${response.status} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('createCalendarEvent error:', error);
    throw error;
  }
};

// Delete Calendar Event (Destructive Operation - Requires Confirmation!)
export const deleteCalendarEvent = async (token: string, eventId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete event failed: ${response.status} - ${errorText}`);
    }
    return true;
  } catch (error) {
    console.error('deleteCalendarEvent error:', error);
    throw error;
  }
};

// Fetch Recent Gmail Emails
export interface GmailEmail {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
  body?: string;
  unread: boolean;
}

export const fetchRecentEmails = async (token: string): Promise<GmailEmail[]> => {
  try {
    // List messages
    const listRes = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=8&q=label:INBOX',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!listRes.ok) {
      const errorText = await listRes.text();
      throw new Error(`Gmail list failed: ${listRes.status} - ${errorText}`);
    }
    const listData = await listRes.json();
    const messages = listData.messages || [];
    
    // Fetch details for each message in parallel
    const emailPromises = messages.map(async (msg: { id: string }) => {
      const detailRes = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!detailRes.ok) return null;
      const detail = await detailRes.json();
      
      const headers = detail.payload?.headers || [];
      const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
      const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
      const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
      
      const isUnread = detail.labelIds?.includes('UNREAD') || false;
      
      return {
        id: detail.id,
        threadId: detail.threadId,
        from: fromHeader,
        subject: subjectHeader,
        date: dateHeader,
        snippet: detail.snippet || '',
        unread: isUnread,
      };
    });

    const results = await Promise.all(emailPromises);
    return results.filter((email): email is GmailEmail => email !== null);
  } catch (error) {
    console.error('fetchRecentEmails error:', error);
    throw error;
  }
};

// Send Email via Gmail API (requires raw build)
export const sendGmailEmail = async (
  token: string,
  to: string,
  subject: string,
  messageBody: string,
  userEmail: string
): Promise<boolean> => {
  try {
    // Build raw email string
    const emailStr = [
      `To: ${to}`,
      `From: ${userEmail}`,
      `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      '',
      messageBody,
    ].join('\n');
    
    const base64SafeUrlRaw = btoa(unescape(encodeURIComponent(emailStr)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: base64SafeUrlRaw,
        }),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gmail send failed: ${response.status} - ${errorText}`);
    }
    return true;
  } catch (error) {
    console.error('sendGmailEmail error:', error);
    throw error;
  }
};

// Google People API / Contacts Interface
export interface WorkspaceContact {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  avatar?: string;
}

export const fetchGoogleContacts = async (token: string): Promise<WorkspaceContact[]> => {
  try {
    const response = await fetch(
      'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations&pageSize=50',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Contacts fetch failed: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    const connections = data.connections || [];
    return connections.map((c: any, index: number) => {
      const name = c.names?.[0]?.displayName || 'Unnamed Connection';
      const email = c.emailAddresses?.[0]?.value || '';
      const phone = c.phoneNumbers?.[0]?.value || '';
      const company = c.organizations?.[0]?.name || '';
      const title = c.organizations?.[0]?.title || '';
      return {
        id: c.resourceName || `contact-${index}`,
        name,
        email,
        phone,
        company,
        title,
      };
    });
  } catch (error) {
    console.error('fetchGoogleContacts error:', error);
    throw error;
  }
};

export const createGoogleContact = async (
  token: string,
  name: string,
  title: string,
  company: string,
  email: string,
  phone: string
): Promise<WorkspaceContact> => {
  try {
    const response = await fetch(
      'https://people.googleapis.com/v1/people:createContact',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          names: [{ givenName: name }],
          emailAddresses: email ? [{ value: email, type: 'work' }] : [],
          phoneNumbers: phone ? [{ value: phone, type: 'work' }] : [],
          organizations: (title || company) ? [{ name: company, title: title, type: 'work' }] : []
        }),
      }
    );
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Contact creation failed: ${response.status} - ${errText}`);
    }
    const c = await response.json();
    const createdName = c.names?.[0]?.displayName || name;
    const createdEmail = c.emailAddresses?.[0]?.value || email;
    const createdPhone = c.phoneNumbers?.[0]?.value || phone;
    const createdCompany = c.organizations?.[0]?.name || company;
    const createdTitle = c.organizations?.[0]?.title || title;
    return {
      id: c.resourceName || `contact-${Date.now()}`,
      name: createdName,
      email: createdEmail,
      phone: createdPhone,
      company: createdCompany,
      title: createdTitle,
    };
  } catch (error) {
    console.error('createGoogleContact error:', error);
    throw error;
  }
};

