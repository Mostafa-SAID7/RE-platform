/**
 * Number formatting utilities for the Real Estate Platform
 */

/**
 * Format a number as currency
 * @param value - Number to format
 * @param locale - Locale code (e.g., 'en-US', 'ar-SA')
 * @param currency - Currency code (e.g., 'USD', 'SAR')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format a number with thousand separators
 * @param value - Number to format
 * @param locale - Locale code
 * @returns Formatted number string
 */
export function formatNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format a number as a percentage
 * @param value - Number to format (0-100 or 0-1)
 * @param locale - Locale code
 * @param decimals - Number of decimal places
 * @param isDecimal - Whether the value is already in decimal form (0-1)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number,
  locale: string = 'en-US',
  decimals: number = 1,
  isDecimal: boolean = false
): string {
  const percentValue = isDecimal ? value : value / 100;
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(percentValue);
}

/**
 * Format a number with compact notation (e.g., 1.2K, 3.5M)
 * @param value - Number to format
 * @param locale - Locale code
 * @returns Compact formatted number string
 */
export function formatCompactNumber(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
}

/**
 * Round a number to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
export function roundTo(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Calculate percentage change between two values
 * @param oldValue - Original value
 * @param newValue - New value
 * @returns Percentage change
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Clamp a number between min and max values
 * @param value - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if a value is a valid number
 * @param value - Value to check
 * @returns True if value is a valid number
 */
export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
