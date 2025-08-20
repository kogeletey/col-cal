import type { MonthNumber } from "./col-cal.type";

export const createDateFromMonthNumber = (
  month: MonthNumber,
  year: number = new Date().getFullYear(),
  day: number = 3,
): Date => {
  return new Date(year, month, day);
};

export const getMonths = (locale: string = "en-US") =>
  Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2000, i, 1).toLocaleString(locale, {
      month: "short",
    });
    return locale.startsWith("ru")
      ? (month.charAt(0).toUpperCase() + month.slice(1)).replace(/\.$/, "")
      : month;
  });

export const getWeeks = (locale: string = "en-US") => {
  const baseDate = new Date(2000, 0, 3);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    return date
      .toLocaleString(locale, { weekday: "narrow" })
      .replace(/\./g, "")
      .charAt(0);
  });
};
