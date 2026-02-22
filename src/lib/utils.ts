/**
 * Safely parses a JSON string, returning a fallback value if parsing fails.
 * Logs a warning if parsing fails.
 *
 * @param value The JSON string to parse (or null)
 * @param fallback The fallback value to return on error
 */
export function safeParse<T>(value: string | null, fallback: T): T {
  if (value == null) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (err) {
    console.warn(
      '[safeParse] Failed to parse JSON:',
      value,
      '\nError:',
      err
    );
    return fallback;
  }
}
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
