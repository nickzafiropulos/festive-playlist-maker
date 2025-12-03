/**
 * Basic analytics tracking
 * Tracks key user actions and events
 */

type AnalyticsEvent =
  | "spotify_connect_clicked"
  | "spotify_connect_success"
  | "spotify_connect_error"
  | "profile_analysis_started"
  | "profile_analysis_completed"
  | "profile_analysis_error"
  | "playlist_generation_started"
  | "playlist_generation_completed"
  | "playlist_generation_error"
  | "playlist_created"
  | "playlist_creation_error"
  | "demo_mode_activated";

interface AnalyticsEventData {
  event: AnalyticsEvent;
  timestamp: number;
  sessionId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

class Analytics {
  private sessionId: string;

  constructor() {
    // Generate or retrieve session ID
    if (typeof window !== "undefined") {
      this.sessionId =
        sessionStorage.getItem("analytics_session_id") ||
        this.generateSessionId();
      sessionStorage.setItem("analytics_session_id", this.sessionId);
    } else {
      this.sessionId = "server";
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track an analytics event
   */
  track(
    event: AnalyticsEvent,
    metadata?: Record<string, unknown>
  ): void {
    if (typeof window === "undefined") return;

    const eventData: AnalyticsEventData = {
      event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      metadata,
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Analytics Event:", eventData);
    }

    // In production, you could send to an analytics service
    // Example: sendToAnalyticsService(eventData);
  }

  /**
   * Track error events
   */
  trackError(
    event: AnalyticsEvent,
    error: Error | string,
    metadata?: Record<string, unknown>
  ): void {
    this.track(event, {
      ...metadata,
      error: error instanceof Error ? error.message : error,
      errorType: error instanceof Error ? error.name : "Unknown",
    });
  }
}

// Singleton instance
export const analytics = new Analytics();

