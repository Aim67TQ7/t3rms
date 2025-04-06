
import Cookies from 'js-cookie';

const ANONYMOUS_ANALYSIS_COOKIE = 't3rms_anonymous_analysis';
export const MAX_ANONYMOUS_ANALYSES = 3;

export const getAnonymousAnalysisCount = (): number => {
  const count = Cookies.get(ANONYMOUS_ANALYSIS_COOKIE);
  return count ? parseInt(count, 10) : 0;
};

export const incrementAnonymousAnalysisCount = (): number => {
  const currentCount = getAnonymousAnalysisCount();
  const newCount = currentCount + 1;
  
  // Set cookie to expire in 30 days
  Cookies.set(ANONYMOUS_ANALYSIS_COOKIE, newCount.toString(), { expires: 30 });
  
  return newCount;
};

export const hasReachedAnonymousLimit = (): boolean => {
  return getAnonymousAnalysisCount() >= MAX_ANONYMOUS_ANALYSES;
};

export const resetAnonymousAnalysisCount = (): void => {
  Cookies.remove(ANONYMOUS_ANALYSIS_COOKIE);
};
