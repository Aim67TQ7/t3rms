
/**
 * Utility functions to manage user credits for document analysis and generation
 */

const FREE_CREDIT_LIMIT = 3; // Free tier limit
const CREDITS_COUNT_KEY = 'user_credits_count';
const PENDING_ANALYSIS_KEY = 'pending_analysis';
const PENDING_DOCUMENT_KEY = 'pending_document';

// Credit packages available for purchase
export const CREDIT_PACKAGES = {
  SMALL: { 
    name: 'Basic Package',
    credits: 10, 
    price: 4.99,
    description: '10 credits for document analysis or generation'
  },
  LARGE: { 
    name: 'Value Package',
    credits: 50, 
    price: 9.99,
    description: '50 credits for document analysis or generation'
  }
};

/**
 * Check if the user has reached their free credit limit
 */
export const hasReachedCreditLimit = (): boolean => {
  const count = getRemainingCredits();
  return count <= 0;
};

/**
 * Get the remaining credits for the user
 */
export const getRemainingCredits = (): number => {
  // For anonymous users, we only check localStorage
  if (!isUserAuthenticated()) {
    const usedCredits = getUsedCredits();
    return Math.max(0, FREE_CREDIT_LIMIT - usedCredits);
  }

  // For authenticated users, we would check their account balance
  // TODO: Implement retrieval of credits from user account in database
  
  // For now, return the same logic for all users
  const usedCredits = getUsedCredits();
  return Math.max(0, FREE_CREDIT_LIMIT - usedCredits);
};

/**
 * Get the number of credits used
 */
export const getUsedCredits = (): number => {
  const countStr = localStorage.getItem(CREDITS_COUNT_KEY);
  return countStr ? parseInt(countStr, 10) : 0;
};

/**
 * Increment the count of credits used by the specified amount
 * @param count Number of credits to consume (default: 1)
 */
export const useCredits = (count: number = 1): void => {
  const currentCount = getUsedCredits();
  localStorage.setItem(CREDITS_COUNT_KEY, (currentCount + count).toString());
};

/**
 * Reset the credit count (primarily for testing or after purchasing credits)
 */
export const resetCredits = (): void => {
  localStorage.removeItem(CREDITS_COUNT_KEY);
};

/**
 * Add purchased credits to user's account
 * @param amount Number of credits to add
 */
export const addCredits = (amount: number): void => {
  // For anonymous users, we reduce the used count
  if (!isUserAuthenticated()) {
    const currentUsed = getUsedCredits();
    localStorage.setItem(CREDITS_COUNT_KEY, Math.max(0, currentUsed - amount).toString());
    return;
  }

  // For authenticated users, we would update their account balance in the database
  // TODO: Implement adding credits to user account in database
  
  // For now, use the same logic for all users
  const currentUsed = getUsedCredits();
  localStorage.setItem(CREDITS_COUNT_KEY, Math.max(0, currentUsed - amount).toString());
};

/**
 * Check if a user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  // This should be replaced with actual authentication check
  // For example, checking if user has a valid session or token
  return false; // Currently assuming anonymous
};

/**
 * Calculate credits needed for policy analysis
 * @param documentSize Size or complexity metric of the document
 */
export const calculateAnalysisCredits = (documentSize: number): number => {
  // Simple calculation based on document size
  // 1 credit per chunk of analysis
  return Math.max(1, Math.ceil(documentSize / 10000)); // 1 credit per 10k chars or part thereof
};

/**
 * Calculate credits needed for policy generation
 * @param policyCount Number of policies to generate
 * @param downloadCount Number of download formats requested
 */
export const calculateGenerationCredits = (policyCount: number, downloadCount: number = 1): number => {
  // 1 credit per policy per download format
  return policyCount * downloadCount;
};

/**
 * Store a pending analysis result for users who need to create an account or purchase credits
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

/**
 * Store a pending generated document for users who need to create an account or purchase credits
 */
export const storePendingDocument = (document: any): void => {
  localStorage.setItem(PENDING_DOCUMENT_KEY, JSON.stringify(document));
};

/**
 * Get and clear the pending generated document
 */
export const getPendingDocument = (): any | null => {
  const pending = localStorage.getItem(PENDING_DOCUMENT_KEY);
  if (pending) {
    localStorage.removeItem(PENDING_DOCUMENT_KEY);
    return JSON.parse(pending);
  }
  return null;
};

/**
 * Check if user needs to purchase credits
 * @param requiredCredits Number of credits the operation requires
 */
export const needsPurchaseCredits = (requiredCredits: number): boolean => {
  return getRemainingCredits() < requiredCredits;
};

