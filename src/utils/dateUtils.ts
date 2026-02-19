/**
 * Formats a date string into DD/MM/YYYY without timezone shifts.
 * Works with both ISO strings (2026-02-23T23:00:00.000Z) and pure date strings (2026-02-23).
 */
export function formatLocalDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';

    try {
        // If it's an ISO string or has 'T', take only the date part
        const cleanDate = dateString.includes('T')
            ? dateString.split('T')[0]
            : dateString;

        // Split by '-' or '/'
        const parts = cleanDate.split(/[-/]/);

        if (parts.length >= 3) {
            const year = parts[0].length === 4 ? parts[0] : parts[2];
            const month = parts[1];
            const day = parts[0].length === 4 ? parts[2] : parts[0];

            return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }

        return dateString;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}
