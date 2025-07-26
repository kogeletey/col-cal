import { LitElement, html, css } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addDays,
  type Locale,
  type Day,
  addMonths,
  subMonths,
  subDays,
} from "date-fns";
import { enUS, ru } from "date-fns/locale";
import { getDay, isSameMonth } from "date-fns/fp";

const LOCALE_MAP: Record<string, Locale> = {
  "en-US": enUS,
  // prettier-ignore
  'ru': ru,
};

@customElement("col-cal")
export class ColCal extends LitElement {
  @property({ type: Object })
  date: Date = new Date();

  @state()
  private _date: Date = this.date;

  @property({ type: String }) locale: string = "en-US";
  @property({ type: Number }) firstDayOfWeek: Day = 1;
  @property({ type: Array }) disabledDates: Date[] = [];
  @property({ type: Object }) selectedDate: Date | null = null;
  @property({ type: Array }) events: Array<{ date: Date; title: string }> = [];

  static get styles() {
    return css`
      :host {
        --calendar-bg: #ffffff;
        --calendar-border: #e0e0e0;
        --calendar-selected-bg: #007bff;
        --calendar-selected-color: #ffffff;
        --calendar-hover-bg: #f0f0f0;
        --event-marker-color: #ff4081;
        --week-number-color: #666666;
        --day-header-color: #333333;
        --disabled-date-color: #cccccc;
        --font-family: "Arial", sans-serif;
        --font-size: 14px;
        --padding: 16px;
        --spacing: 4px;
      }

      .calendar {
        background: var(--calendar-bg);
        border: 1px solid var(--calendar-border);
        font-family: var(--font-family);
        font-size: var(--font-size);
        padding: var(--padding);
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing);
      }

      .nav-button {
        background: none;
        border: none;
        font-size: 1.2em;
        cursor: pointer;
      }

      .nav-button:disabled {
        opacity: 0.5;
      }

      .week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: var(--spacing);
        margin-bottom: var(--spacing);
      }

      .day-header {
        text-align: center;
        color: var(--day-header-color);
      }

      .day {
        text-align: center;
        padding: 4px;
        apperance: none;
        border: 0;
        outline: 0;
        background: transparent;
        cursor: pointer;
        position: relative;
      }

      .day:hover {
        background: var(--calendar-hover-bg);
      }

      .day.selected {
        background: var(--calendar-selected-bg);
        color: var(--calendar-selected-color);
      }

      .day.disabled {
        color: var(--disabled-date-color);
        cursor: default;
      }

      .event-marker {
        position: absolute;
        bottom: 4px;
        right: 4px;
        width: 6px;
        height: 6px;
        background: var(--event-marker-color);
        border-radius: 50%;
      }

      .week-number {
        color: var(--week-number-color);
        text-align: right;
      }
    `;
  }

  private getPrevMonthDays(): Date[] {
    const start = startOfMonth(this._date);
    const firstDay = getDay(start);
    const daysBefore = (firstDay - this.firstDayOfWeek + 7) % 7;
    const prevMonthStart = subDays(start, daysBefore);
    return eachDayOfInterval({
      start: prevMonthStart,
      end: subDays(start, 1),
    });
  }

  private getNextMonthDays(): Date[] {
    const end = endOfMonth(this._date);
    const nextDay = addDays(end, 1);
    const lastDay = getDay(nextDay);
    const daysAfter = (7 - ((lastDay - this.firstDayOfWeek + 7) % 7)) % 7;
    const nextMonthStart = addDays(end, 1);
    const nextMonthEnd = addDays(nextMonthStart, daysAfter - 1);
    return eachDayOfInterval({
      start: nextMonthStart,
      end: nextMonthEnd,
    });
  }

  private getMonthDays() {
    const currentMonthDays = eachDayOfInterval({
      start: startOfMonth(this._date),
      end: endOfMonth(this._date),
    });

    this.disabledDates = [
      ...this.getPrevMonthDays(),
      ...this.getNextMonthDays(),
    ];

    return [
      ...this.getPrevMonthDays(),
      ...currentMonthDays,
      ...this.getNextMonthDays(),
    ];
  }

  private currentLocale() {
    return LOCALE_MAP[this.locale] || enUS;
  }

  private isDateDisabled(date: Date) {
    return this.disabledDates.some((d) => isSameDay(date, d));
  }

  private handleDateSelect(date: Date) {
    if (!this.isDateDisabled(date)) {
      this.selectedDate = date;
      this.dispatchEvent(new CustomEvent("date-selected", { detail: date }));
    }
  }

  render() {
    const days = this.getMonthDays();
    return html`
      <div class="calendar" part="base">
        <div class="header" part="header">
          <div>
            <slot name="header-date">
              ${format(this._date, "MMMM yyyy", {
                locale: this.currentLocale(),
              })}
            </slot>
          </div>
          <div>
            <button
              part="left-button"
              class="nav-button"
              @click=${() => (this._date = subMonths(this._date, 1))}
            >
              <slot name="icon-left-button"> &lt; </slot>
            </button>
            <button
              class="nav-button"
              part="right-button"
              @click=${() => (this._date = addMonths(this._date, 1))}
            >
              <slot name="icon-right-button"> &gt; </slot>
            </button>
          </div>
        </div>

        <div class="week">
          ${["П", "В", "C", "Ч", "П", "C", "В"].map(
            (day) => html`<div class="day-header">${day}</div>`,
          )}
        </div>
        <div class="week">
          ${days.map((date) => {
            const isSelected =
              this.selectedDate !== null
                ? this.selectedDate && isSameDay(date, this.selectedDate)
                : isSameMonth(date, new Date(this.date)) &&
                  isSameDay(date, new Date(this.date));

            const isDisabled = this.isDateDisabled(date);
            return html`
              <button
                class="day ${isSelected ? "selected" : ""} ${isDisabled
                  ? "disabled"
                  : ""}"
                @click=${() => this.handleDateSelect(date)}
                aria-label=${format(date, "PPP", {
                  locale: this.currentLocale(),
                })}
                role="gridcell"
              >
                ${date.getDate()}
              </button>
            `;
          })}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "col-cal": ColCal;
  }
}
