/**
 * Formats a date into a readable format
 * @param {Date} date
 * @return {string} New, more readable date object
 */
export default function showDate(date) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(new Date(date));
}
