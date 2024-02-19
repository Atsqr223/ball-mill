import moment from "moment";

export const utcToLocalTime = (
  dateTimeString,
  format = "MM-DD-YYYY h:mm A"
) => {
  return (dateTimeString ? moment(dateTimeString) : moment()).format(format);
};

export const localToUtcTime = (
  dateTimeString,
  format = "MM-DD-YYYY h:mm A"
) => {
  return (dateTimeString ? moment(dateTimeString) : moment()).utc().format(format);
};
