/*
	Purpose of file: Calculate and format the age of an issue
	based on when it was created
*/

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
    let minutes = Math.floor(difference / 60000);
    if (minutes >= 1) {
        if (minutes === 1) {
            return "1 minute";
        } else {
            return minutes.toString() + " minutes";
        }
    } else {
        return "less than a minute"
    }
}