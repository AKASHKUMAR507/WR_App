import Aphrodite from "./aphrodite";

class Chronos {
    ConvertUTCToLocal(timestamp) {
        const utcDate = new Date(timestamp);
        const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
        return localDate;
    }

    FormattedDateMinFromTimestamp(timestamp) {
        const date = this.ConvertUTCToLocal(timestamp);
        const localDate = date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return localDate;
    }

    FormattedDateFromTimestamp(timestamp) {
        const date = this.ConvertUTCToLocal(timestamp);
        const localDate = date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return localDate;
    }

    FormattedNumericDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        /**Ensure two digits**/
        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        /** Get the month as a three-letter string **/
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    FormattedTimeFromTimestamp(timestamp) {
        const date = this.ConvertUTCToLocal(timestamp);
        const localTime = date.toLocaleString(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        return localTime;
    }

    FormattedDateTimeFromTimestamp(timestamp) {
        const localDate = this.FormattedDateMinFromTimestamp(timestamp);
        const localTime = this.FormattedTimeFromTimestamp(timestamp);

        return `${localDate}, ${localTime}`;
    }

    FormattedDateDayFromTimestamp(timestamp) {
        const date = this.ConvertUTCToLocal(timestamp);
        const localDate = date.toLocaleString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });

        return localDate;
    }

    FormattedLocalDateFromTimestamp = (timestamp) => {
        const utcDate = new Date(timestamp);
        const localDate = utcDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return localDate;
    }

    IsSameDay(timestamp1, timestamp2) {
        const date1 = this.ConvertUTCToLocal(timestamp1);
        const date2 = this.ConvertUTCToLocal(timestamp2);

        return date1.getFullYear() === date2.getFullYear()
            && date1.getMonth() === date2.getMonth()
            && date1.getDate() === date2.getDate();
    }

    NamedDayOrDateFromTimestamp(timestamp) {
        const date = this.ConvertUTCToLocal(timestamp);
        const now = new Date();

        const elapsed = now.getTime() - date.getTime();

        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return this.FormattedDateDayFromTimestamp(timestamp);

        return this.FormattedDateMinFromTimestamp(timestamp);
    }

    ElapsedTimeFromTimestamp(timestamp) {
        const date = this.ConvertUTCToLocal(timestamp);
        const now = new Date();

        const elapsed = now.getTime() - date.getTime();

        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) return years === 1 ? 'A Year Ago' : `${Aphrodite.FormatToTwoDigits(years)} Years Ago`
        if (months > 0) return months === 1 ? 'A Month Ago' : `${Aphrodite.FormatToTwoDigits(months)} Months Ago`
        if (days > 0) return days === 1 ? 'A Day Ago' : `${Aphrodite.FormatToTwoDigits(days)} Days Ago`;
        if (hours > 0) return hours === 1 ? 'An Hour Ago' : `${Aphrodite.FormatToTwoDigits(hours)} Hours Ago`;
        if (minutes > 0) return minutes === 1 ? 'A Minute Ago' : `${Aphrodite.FormatToTwoDigits(minutes)} Minutes Ago`;

        return 'Just Now';
    }

    DateDifference(timestamp1, timestamp2) {
        if (!timestamp2) { return "On Hold!" };

        const newTimestamp1 = new Date(timestamp1);
        const newTimestamp2 = new Date(timestamp2);

        // NOTE: (newTimestamp1 < newTimestamp2) Finding Delayed In Time
        const delayTimeDifferenceMilliseconds = newTimestamp2 - newTimestamp1;
        const days = Math.round(delayTimeDifferenceMilliseconds / (1000 * 60 * 60 * 24));

        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);

        if (days == 0) { return "On Time!"; }
        else if (days < 0) { return `Earlier by ${Math.abs(days)} Days`; }
        else if (days < 7) { return `Delayed by ${days} Day`; }
        else if (weeks == 1) { return `Delayed by ${weeks} Week` }
        else if (weeks > 0 && weeks <= 4) { return `Delayed by ${weeks} Weeks` }
        else if (months == 1) { return `Delayed by ${months} Month` }
        else if (weeks > 4 && months > 0) { return `Delayed by ${months} Months` }
        else { return `Earlier by ${days} Day` }

    }

    ElapsedSingleTimeFromTimestamp(timestamp) {
        const date = this.ConvertUTCToLocal(timestamp);
        const now = new Date();

        const elapsed = now.getTime() - date.getTime();

        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        if (years > 0) return years === 1 ? '' : `${Aphrodite.FormatToSingleDigits(years)}y`
        if (months > 0) return months === 1 ? '' : `${Aphrodite.FormatToSingleDigits(months)}m`
        if (days > 0) return days === 1 ? '' : `${Aphrodite.FormatToSingleDigits(days)}d`;
        if (hours > 0) return hours === 1 ? '' : `${Aphrodite.FormatToSingleDigits(hours)}h`;
        if (minutes > 0) return minutes === 1 ? '' : `${Aphrodite.FormatToSingleDigits(minutes)}m`;

        return 'Just Now';
    }

    NotificationTime(timestamp) {
        const now = new Date().getTime();
        const newDate = new Date(timestamp);
        const differenceInSeconds = Math.floor((now - newDate) / 1000);

        if (differenceInSeconds < 60) {
            return 'now';
        }

        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        if (differenceInMinutes < 60) {
            return `${differenceInMinutes}m`; // Return in minutes
        }

        const differenceInHours = Math.floor(differenceInMinutes / 60);
        if (differenceInHours < 24) {
            return `${differenceInHours}h`; // Return in hours
        }

        const differenceInDays = Math.floor(differenceInHours / 24);
        if (differenceInDays < 7) {
            return `${differenceInDays}d`; // Return in days
        }

        const differenceInWeeks = Math.floor(differenceInDays / 7);
        if (differenceInWeeks < 4) {
            return `${differenceInWeeks}w`; // Return in weeks
        }

        const differenceInMonths = Math.floor(differenceInDays / 30);
        if (differenceInMonths < 12) {
            return `${differenceInMonths}mo`; // Return in months
        }

        const differenceInYears = Math.floor(differenceInDays / 365);
        return `${differenceInYears}y`; // Return in years
    }

    ExtendedDays(timestamps, days) {
        let newTimestamps = new Date(timestamps);
        newTimestamps.setDate(newTimestamps.getDate() + days);
        return newTimestamps;
    }

    static SortObjectsByDate(objects, key = 'createddate', descending = true) {
        if (objects.length === 0 || objects.length === 1) return objects;
        return objects.sort((a, b) => descending ? new Date(b[key]) - new Date(a[key]) : new Date(a[key]) - new Date(b[key]));
    }

    static SortArrayOfObjectByKey(array, key = 'createddate', descending = true) {
        if (array.length === 0 || array.length === 1) return array;
        return array.sort((a, b) => descending ? b[key] - a[key] : a[key] - b[key]);
    }
}

export default Chronos;