/**
 * Constants for timing and delays throughout the application
 */

/**
 * Delay in milliseconds to wait after a mutation success
 * before updating the query cache.
 */
export const MUTATION_CACHE_UPDATE_DELAY = 500;

/**
 * Standard debounce time for search inputs, in milliseconds
 */
export const SEARCH_DEBOUNCE_DELAY = 300;

/**
 * Time to show success notifications, in milliseconds
 */
export const SUCCESS_NOTIFICATION_DURATION = 3000;

/**
 * Time to show error notifications, in milliseconds
 */
export const ERROR_NOTIFICATION_DURATION = 5000;

/**
 * Cache time for React Query data in milliseconds
 * This controls how long data stays in cache after becoming inactive
 */
export const QUERY_CACHE_TIME = 1000 * 60 * 60; // 1 hour 