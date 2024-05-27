export function formatDate(dateInput: string | Date) {
    const date = new Date(dateInput);
    const day = date.getDate();  // Day as a number (1-31)
    const month = date.getMonth() + 1;  // Month as a number (0-11), adjusted to (1-12)
    const year = date.getFullYear();  // Four-digit year

    // Pad single digit day and month with leading zero and format as dd/mm/yyyy
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
}