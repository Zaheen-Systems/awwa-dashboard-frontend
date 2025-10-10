// Centralized date utilities for Singapore timezone
import { formatInTimeZone } from "date-fns-tz";

// Singapore timezone constant
export const SINGAPORE_TIMEZONE = "Asia/Singapore";

/**
 * Format a date in Singapore time with a custom format pattern
 * @param date - Date object or ISO string
 * @param formatStr - date-fns format string (e.g., "dd.MM.yy", "h:mm a")
 * @returns Formatted date string in Singapore time
 */
export function formatSingaporeTime(date: Date | string, formatStr: string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return formatInTimeZone(dateObj, SINGAPORE_TIMEZONE, formatStr);
}

/**
 * Format a date for display in Singapore time (e.g., "20/01/2025, 3:45 PM")
 * @param date - Date object or ISO string
 * @returns Formatted date string with date and time
 */
export function formatSingaporeDateTimeDisplay(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleString('en-SG', { 
    timeZone: SINGAPORE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format a date for display in Singapore time (date only, e.g., "20/01/2025")
 * @param date - Date object or ISO string
 * @returns Formatted date string (date only)
 */
export function formatSingaporeDateDisplay(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('en-SG', { 
    timeZone: SINGAPORE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}


