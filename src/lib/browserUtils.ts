/**
 * Safely checks if code is running in browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Safely executes a function only in browser environment
 * @param fn Function to execute in browser
 * @param fallback Optional fallback value for server-side
 */
export const runInBrowser = <T>(fn: () => T, fallback?: T): T => {
  if (!isBrowser()) {
    return fallback as T;
  }
  
  try {
    return fn();
  } catch (error) {
    console.error('Browser operation failed:', error);
    return fallback as T;
  }
}; 