interface UsageData {
  workouts_created: number;
  ai_requests: number;
  last_reset: string;
}

class UsageTracker {
  private getUsageKey(userId: string): string {
    return `usage_tracking_${userId}`;
  }

  private getUsageData(userId: string): UsageData {
    const key = this.getUsageKey(userId);
    const data = localStorage.getItem(key);
    
    if (!data) {
      const initialData: UsageData = {
        workouts_created: 0,
        ai_requests: 0,
        last_reset: new Date().toDateString()
      };
      localStorage.setItem(key, JSON.stringify(initialData));
      return initialData;
    }
    
    const usage = JSON.parse(data) as UsageData;
    
    // Reset daily limits if it's a new day
    const today = new Date().toDateString();
    if (usage.last_reset !== today) {
      usage.ai_requests = 0; // Reset daily AI requests
      usage.last_reset = today;
      localStorage.setItem(key, JSON.stringify(usage));
    }
    
    return usage;
  }

  trackWorkoutCreation(userId: string): boolean {
    const usage = this.getUsageData(userId);
    
    // For free users, limit is 3 workouts total (not daily)
    if (usage.workouts_created >= 3) {
      return false; // Limit reached
    }
    
    usage.workouts_created++;
    localStorage.setItem(this.getUsageKey(userId), JSON.stringify(usage));
    return true;
  }

  trackAIRequest(userId: string): boolean {
    const usage = this.getUsageData(userId);
    
    // For free users, limit is 5 AI requests per day
    if (usage.ai_requests >= 5) {
      return false; // Daily limit reached
    }
    
    usage.ai_requests++;
    localStorage.setItem(this.getUsageKey(userId), JSON.stringify(usage));
    return true;
  }

  getUsage(userId: string): UsageData {
    return this.getUsageData(userId);
  }

  resetUsage(userId: string): void {
    const initialData: UsageData = {
      workouts_created: 0,
      ai_requests: 0,
      last_reset: new Date().toDateString()
    };
    localStorage.setItem(this.getUsageKey(userId), JSON.stringify(initialData));
  }
}

export const usageTracker = new UsageTracker();