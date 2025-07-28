import type { MonthNumber } from "./col-cal.type";

export const createDateFromMonthNumber = (
  month: MonthNumber,
  year: number = new Date().getFullYear(),
  day: number = 3,
): Date => {
  return new Date(year, month, day);
};

export const months = {
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  ru: [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ],
};
