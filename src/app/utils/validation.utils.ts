/**
 * Validation utilities for the Real Estate Platform
 */

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (US format)
 * @param phone - Phone number string to validate
 * @returns True if phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate ZIP code format (US format)
 * @param zipCode - ZIP code string to validate
 * @returns True if ZIP code is valid
 */
export function isValidZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * Validate URL format
 * @param url - URL string to validate
 * @returns True if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string is empty or contains only whitespace
 * @param value - String to check
 * @returns True if string is empty or whitespace
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Check if a value is within a specified range
 * @param value - Number to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate that a date is not in the past
 * @param date - Date to validate
 * @returns True if date is today or in the future
 */
export function isFutureDate(date: Date | string): boolean {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return targetDate >= today;
}

/**
 * Validate that a date is within a valid year range
 * @param year - Year to validate
 * @param minYear - Minimum year (default: 1800)
 * @param maxYear - Maximum year (default: current year + 10)
 * @returns True if year is valid
 */
export function isValidYear(year: number, minYear: number = 1800, maxYear?: number): boolean {
  const max = maxYear || new Date().getFullYear() + 10;
  return year >= minYear && year <= max;
}

/**
 * Sanitize a string by removing HTML tags
 * @param value - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  return { isValid: true, message: 'Password is strong' };
}

/**
 * Validate required fields in an object
 * @param obj - Object to validate
 * @param requiredFields - Array of required field names
 * @returns Array of missing field names
 */
export function validateRequiredFields(obj: any, requiredFields: string[]): string[] {
  return requiredFields.filter(field => {
    const value = obj[field];
    return value === null || value === undefined || (typeof value === 'string' && isEmpty(value));
  });
}
