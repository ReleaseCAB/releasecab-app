//Takes in a string date in UTC and returns the date in the user's locale
export function ConvertTimeToLocale(dateString) {
  if (!dateString || dateString === "") {
    return null;
  }

  const dateTime = new Date(dateString);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userDateTime = dateTime.toLocaleString(undefined, {
    timeZone: userTimeZone,
    timeZoneName: "short",
  });

  return userDateTime;
}
