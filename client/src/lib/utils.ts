import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
