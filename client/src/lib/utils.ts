import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Resolves combines Tailwind/Nativewind and CSS and removes conflicts
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * @param a - First Date object.
 * @param b - Second Date object.
 * @returns amount of days between a and b, includes both a and b.
 */
export function dateDifference(a: Date, b: Date) {
    return Math.ceil(Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Formats a date to ISO date format (YYYY-MM-DD)
 *
 * @param date the date to format
 */
export function formatDate(date: Date): string {
    return date.toISOString().substring(0, 10);
}
