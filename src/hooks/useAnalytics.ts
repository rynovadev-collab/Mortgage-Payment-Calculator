import { useEffect } from 'react';
import { useAuth } from './useAuth';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: string;
  userId?: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private maxEvents = 1000;

  constructor() {
    // Make analytics available globally for error boundary
    (window as any).trackEvent = this.track.bind(this);
  }

  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId()
    };

    this.events.push(analyticsEvent);
    
    // Keep only the last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics:', analyticsEvent);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events.slice(-100))); // Store last 100
    } catch (error) {
      console.warn('Failed to store analytics events:', error);
    }
  }

  private getCurrentUserId(): string | undefined {
    try {
      const authData = localStorage.getItem('sb-cvlkhzxrbbemklouceyf-auth-token');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.user?.id;
      }
    } catch (error) {
      // Silently fail
    }
    return undefined;
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  clearEvents() {
    this.events = [];
    localStorage.removeItem('analytics_events');
  }

  // Load events from localStorage on initialization
  loadStoredEvents() {
    try {
      const stored = localStorage.getItem('analytics_events');
      if (stored) {
        const events = JSON.parse(stored);
        this.events = [...events, ...this.events];
      }
    } catch (error) {
      console.warn('Failed to load stored analytics events:', error);
    }
  }
}

// Singleton instance
const analyticsService = new AnalyticsService();

export const useAnalytics = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Load stored events on first use
    analyticsService.loadStoredEvents();
  }, []);

  useEffect(() => {
    // Track user sessions
    if (user) {
      analyticsService.track('user_session_start', {
        userId: user.id,
        email: user.email
      });
    } else {
      analyticsService.track('user_session_end');
    }
  }, [user]);

  const track = (event: string, properties?: Record<string, any>) => {
    analyticsService.track(event, properties);
  };

  const pageView = (page: string, additionalProps?: Record<string, any>) => {
    track('page_view', {
      page,
      url: window.location.href,
      referrer: document.referrer,
      ...additionalProps
    });
  };

  return {
    track,
    pageView,
    getEvents: () => analyticsService.getEvents(),
    exportEvents: () => analyticsService.exportEvents(),
    clearEvents: () => analyticsService.clearEvents()
  };
};

export default analyticsService;
