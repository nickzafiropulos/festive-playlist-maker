/**
 * Rate limiting utilities
 * Prevents excessive API calls
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  /**
   * Check if a request is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.store[identifier];

    if (!record || now > record.resetAt) {
      // Create new window
      this.store[identifier] = {
        count: 1,
        resetAt: now + this.windowMs,
      };
      return true;
    }

    if (record.count >= this.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Get time until rate limit resets
   */
  getTimeUntilReset(identifier: string): number {
    const record = this.store[identifier];
    if (!record) return 0;
    return Math.max(0, record.resetAt - Date.now());
  }

  /**
   * Get remaining requests
   */
  getRemaining(identifier: string): number {
    const record = this.store[identifier];
    if (!record) return this.maxRequests;
    return Math.max(0, this.maxRequests - record.count);
  }
}

// Rate limiters for different endpoints
export const groqRateLimiter = new RateLimiter(60 * 1000, 10); // 10 requests per minute
export const spotifyRateLimiter = new RateLimiter(60 * 1000, 50); // 50 requests per minute

/**
 * Get rate limit identifier from request
 */
export function getRateLimitId(sessionId?: string, userId?: string): string {
  return userId || sessionId || "anonymous";
}

