/**
 * Formats a given date string into a "DD MMM YYYY" format.
 * @param {string | Date} dateInput - The date string or Date object to format.
 * @returns {string} - The formatted date.
 */
export const formatDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};
