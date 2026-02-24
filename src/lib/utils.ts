import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTournamentDate(dateRange: string): string {
  try {
    // Extract the first date (before ' - ' part)
    const firstDatePart = dateRange.split(' - ')[0];

    // Remove ordinal suffixes (st, nd, rd, th)
    const cleanDate = firstDatePart.replace(/(\d+)(st|nd|rd|th)/, '$1'); 

    // Split into month and day
    const [month, day] = cleanDate.replace('.', '').split(' '); // Remove dot from month

    if (!month || !day) throw new Error('Invalid date format');

    // Convert month to numeric format
    const monthIndex = new Date(`${month} 1, 2000`).getMonth(); // Get month index (0-based)
    const dayOfMonth = parseInt(day, 10);

    // Build an event date for the current year first, then roll to next year if already passed.
    const now = new Date();
    let eventYear = now.getFullYear();
    let eventDate = new Date(eventYear, monthIndex, dayOfMonth, 8, 0, 0);
    if (eventDate.getTime() <= now.getTime()) {
      eventYear += 1;
      eventDate = new Date(eventYear, monthIndex, dayOfMonth, 8, 0, 0);
    }

    if (isNaN(eventDate.getTime())) throw new Error('Invalid date constructed');

    return eventDate.toISOString(); // Convert to ISO format
  } catch (error) {
    console.error("Error parsing date:", error);
    return ''; // Return empty string or handle error in UI
  }
}
