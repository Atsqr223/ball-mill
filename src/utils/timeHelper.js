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
