
/**
 * Utility functions to manage anonymous usage limits
 */

const ANONYMOUS_ANALYSIS_LIMIT = 3; // Keeping the free tier limit
const ANONYMOUS_ANALYSIS_COUNT_KEY = 'anonymous_analysis_count';
const PENDING_ANALYSIS_KEY = 'pending_analysis';

/**
 * Check if the anonymous user has reached their limit of free analyses
 */
export const hasReachedAnonymousLimit = (): boolean => {
  const count = getAnonymousAnalysisCount();
  return count >= ANONYMOUS_ANALYSIS_LIMIT;
};

/**
 * Increment the count of analyses performed by an anonymous user
 */
export const incrementAnonymousAnalysisCount = (): void => {
  const currentCount = getAnonymousAnalysisCount();
  localStorage.setItem(ANONYMOUS_ANALYSIS_COUNT_KEY, (currentCount + 1).toString());
};

/**
 * Get the current count of analyses performed by an anonymous user
 */
export const getAnonymousAnalysisCount = (): number => {
  const countStr = localStorage.getItem(ANONYMOUS_ANALYSIS_COUNT_KEY);
  return countStr ? parseInt(countStr, 10) : 0;
};

/**
 * Reset the anonymous analysis count
 */
export const resetAnonymousAnalysisCount = (): void => {
  localStorage.removeItem(ANONYMOUS_ANALYSIS_COUNT_KEY);
};

/**
 * Store a pending analysis result for anonymous users
 */
export const storePendingAnalysis = (result: any): void => {
  localStorage.setItem(PENDING_ANALYSIS_KEY, JSON.stringify(result));
};

/**
 * Get and clear the pending analysis result
 */
export const getPendingAnalysis = (): any | null => {
  const pending = localStorage.getItem(PENDING_ANALYSIS_KEY);
  if (pending) {
    localStorage.removeItem(PENDING_ANALYSIS_KEY);
    return JSON.parse(pending);
  }
  return null;
};

