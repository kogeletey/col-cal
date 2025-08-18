import { type Locale } from "date-fns/locale";
import * as allDateFnsLocales from "date-fns/locale";

export class LocaleUtils {
  locale = "en-US";

  constructor(locale: string) {
    this.locale = locale;
  }

  static LOCALE_MAP: Record<string, Locale> = Object.values(
    allDateFnsLocales,
  ).reduce((acc: Record<string, Locale>, locale) => {
    acc[locale.code] = locale;
    return acc;
  }, {});

  currentLocale() {
    return LocaleUtils.LOCALE_MAP[this.locale] || allDateFnsLocales.enUS;
  }
}
