/* Purpose of file: Calculate and format the age of an issue
based on when it was created */

/**
 * Converts the time an issue was made at to a readable string
 * @param {string} dateString
 * @return {string} A string based on how long ago the issue was made
 */
export default function getAge(dateString) {
  const openedAt = new Date(dateString);
  const current = new Date(Date.now());
  const difference = current.getTime() - openedAt.getTime();
  const days = Math.floor(difference / 86400000);
  if (days >= 1) {
    if (days === 1) {
      return '1 day';
    } else {
      return days.toString() + ' days';
    }
  }
  const hours = Math.floor(difference / 3600000);
  if (hours >= 1) {
    if (hours === 1) {
      return '1 hour';
    } else {
      return hours.toString() + ' hours';
    }
  }
  const minutes = Math.floor(difference / 60000);
  if (minutes >= 1) {
    if (minutes === 1) {
      return '1 minute';
    } else {
      return minutes.toString() + ' minutes';
    }
  } else {
    return 'less than a minute';
  }
}
