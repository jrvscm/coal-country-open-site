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
    const monthIndex = new Date(`${month} 1, 2025`).getMonth(); // Get month index (0-based)

    // Construct the date assuming the year 2025 and time 8:00 AM
    const eventDate = new Date(2025, monthIndex, parseInt(day), 8, 0, 0); 

    if (isNaN(eventDate.getTime())) throw new Error('Invalid date constructed');

    return eventDate.toISOString(); // Convert to ISO format
  } catch (error) {
    console.error("Error parsing date:", error);
    return ''; // Return empty string or handle error in UI
  }
}
