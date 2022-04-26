export default function getAge(dateString) {
    let openedAt = new Date(dateString);
    let current = new Date(Date.now())
    let difference = current.getTime() - openedAt.getTime()
    let days = Math.floor(difference / 86400000);
    if (days >= 1) {
        if (days === 1) {
            return "1 day";
        } else {
            return days.toString() + " days";
        }
    }
    let hours = Math.floor(difference / 3600000);
    if (hours >= 1) {
        if (hours === 1) {
            return "1 hour";
        } else {
            return hours.toString() + " hours";
        }
    }
    let mins = Math.floor(difference / 60000);
    if (mins >= 1) {
        if (mins === 1) {
            return "1 minute";
        } else {
            return mins.toString() + " minutes";
        }
    } else {
        return "less than a minute"
    }
}