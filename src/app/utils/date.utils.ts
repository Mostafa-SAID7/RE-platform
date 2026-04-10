/**
 * Date formatting utilities for the Real Estate Platform
 */

/**
 * Format a date to a localized string
 * @param date - Date to format
 * @param locale - Locale code (e.g., 'en-US', 'ar-SA')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Format a date to a short format (MM/DD/YYYY or DD/MM/YYYY)
 * @param date - Date to format
 * @param locale - Locale code
 * @returns Short formatted date string
 */
export function formatShortDate(date: Date | string, locale: string = 'en-US'): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Format a date to a long format (e.g., "January 15, 2024")
 * @param date - Date to format
 * @param locale - Locale code
 * @returns Long formatted date string
 */
export function formatLongDate(date: Date | string, locale: string = 'en-US'): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculate the number of days between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days between dates
 */
export function daysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is within a specified number of days from today
 * @param date - Date to check
 * @param days - Number of days
 * @returns True if date is within the specified days
 */
export function isWithinDays(date: Date | string, days: number): boolean {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diffDays = daysBetween(today, targetDate);
  return diffDays <= days && targetDate >= today;
}

/**
 * Check if a date is in the past
 * @param date - Date to check
 * @returns True if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  return targetDate < new Date();
}

/**
 * Get relative time string (e.g., "2 days ago", "in 3 weeks")
 * @param date - Date to format
 * @param locale - Locale code
 * @returns Relative time string
 */
export function getRelativeTime(date: Date | string, locale: string = 'en-US'): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (Math.abs(diffDays) < 7) {
    return diffDays > 0 ? `In ${diffDays} days` : `${Math.abs(diffDays)} days ago`;
  }

  const diffWeeks = Math.floor(Math.abs(diffDays) / 7);
  if (diffWeeks < 4) {
    return diffDays > 0 ? `In ${diffWeeks} weeks` : `${diffWeeks} weeks ago`;
  }

  const diffMonths = Math.floor(Math.abs(diffDays) / 30);
  return diffDays > 0 ? `In ${diffMonths} months` : `${diffMonths} months ago`;
}
