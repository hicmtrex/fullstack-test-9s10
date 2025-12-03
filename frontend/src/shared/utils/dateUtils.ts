/**
 * Date utility functions
 * Provides common date manipulation and formatting functions
 */

/**
 * Calculates the number of nights between two dates
 * @param checkIn - Check-in date string (YYYY-MM-DD)
 * @param checkOut - Check-out date string (YYYY-MM-DD)
 * @returns Number of nights
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate.getTime() - checkInDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

/**
 * Formats a date string to a readable format
 * @param dateString - Date string (YYYY-MM-DD)
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  locale: string = 'en-US'
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date to YYYY-MM-DD format
 * @param date - Date object or date string
 * @returns Formatted date string
 */
export function formatDateInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export function getTodayDate(): string {
  return formatDateInput(new Date());
}

/**
 * Validates that check-out date is after check-in date
 * @param checkIn - Check-in date string
 * @param checkOut - Check-out date string
 * @returns True if check-out is after check-in
 */
export function validateDateRange(checkIn: string, checkOut: string): boolean {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return checkOutDate > checkInDate;
}

