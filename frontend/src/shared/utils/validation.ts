/**
 * Validation utility functions
 * Provides common form validation functions
 */

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates that a value is not empty
 * @param value - Value to validate
 * @returns True if value is not empty
 */
export function isNotEmpty(value: string | number | null | undefined): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return true;
}

/**
 * Validates that a number is positive
 * @param value - Number to validate
 * @returns True if number is positive
 */
export function isPositive(value: number): boolean {
  return value > 0;
}

/**
 * Validates that a number is non-negative
 * @param value - Number to validate
 * @returns True if number is non-negative
 */
export function isNonNegative(value: number): boolean {
  return value >= 0;
}

/**
 * Validates date string format (YYYY-MM-DD)
 * @param dateString - Date string to validate
 * @returns True if date format is valid
 */
export function isValidDateString(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

