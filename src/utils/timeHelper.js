import moment from "moment";

export const utcToLocalTime = (
  dateTimeString,
  format = "DD-MM-YYYY h:mm A"
) => {
  return (dateTimeString ? moment(dateTimeString) : moment()).format(format);
};

export const localToUtcTime = (
  dateTimeString,
  format = "DD-MM-YYYY h:mm A"
) => {
  return (dateTimeString ? moment(dateTimeString) : moment()).utc().format(format);
};

export const timeAgo = (utcTimestamp) => {
  // Convert UTC timestamp to Date object
  const utcDate = new Date(utcTimestamp);

  // Convert UTC time to local time
  const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));

  // Calculate time difference in milliseconds
  const timeDifference = Date.now() - localDate.getTime();

  // Calculate how many seconds ago
  const secondsAgo = Math.floor(timeDifference / 1000);

  // Calculate how many minutes ago
  const minutesAgo = Math.floor(secondsAgo / 60);

  // Calculate how many hours ago
  const hoursAgo = Math.floor(minutesAgo / 60);

  // Calculate how many days ago
  const daysAgo = Math.floor(hoursAgo / 24);

  // Calculate how many months ago
  const monthsAgo = Math.floor(daysAgo / 30);

  // Calculate how many years ago
  const yearsAgo = Math.floor(monthsAgo / 12);

  // Determine the most appropriate time unit
  let timeAgo;
  if (yearsAgo > 0) {
    timeAgo = yearsAgo + " year" + (yearsAgo === 1 ? "" : "s");
  } else if (monthsAgo > 0) {
    timeAgo = monthsAgo + " month" + (monthsAgo === 1 ? "" : "s");
  } else if (daysAgo > 0) {
    timeAgo = daysAgo + " day" + (daysAgo === 1 ? "" : "s");
  } else if (hoursAgo > 0) {
    timeAgo = hoursAgo + " hour" + (hoursAgo === 1 ? "" : "s");
  } else if (minutesAgo > 0) {
    timeAgo = minutesAgo + " minute" + (minutesAgo === 1 ? "" : "s");
  } else {
    timeAgo = secondsAgo + " second" + (secondsAgo === 1 ? "" : "s");
  }

  // Return the local date and time along with how long ago it was
  // return { localDate, timeAgo };
  return timeAgo;
}
