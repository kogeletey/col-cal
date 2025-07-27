import { enUS, ru, type Locale } from "date-fns/locale";

export class LocaleUtils {
  locale = "en-US";

  constructor(locale: string) {
    this.locale = locale;
  }

  static LOCALE_MAP: Record<string, Locale> = {
    "en-US": enUS,
    // prettier-ignore
    'ru': ru,
  };

  currentLocale() {
    return LocaleUtils.LOCALE_MAP[this.locale] || enUS;
  }
}
