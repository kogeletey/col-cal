import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    addDays,
    type Day,
    subDays,
} from "date-fns";
import { getDay, isSameMonth } from "date-fns/fp";
import { LocaleUtils } from "./locale-utils";

@customElement("col-cal-dates")
export class ColCalDate extends LitElement {
    @property({ type: Date })
    month: Date | null = null;

    @property({ type: Date })
    selectedDate: Date | null = null;

    @property({ type: String }) locale: string = "en-US";
    @property({ type: Number }) firstDayOfWeek: Day = 1;
    @property({ type: Array }) disabledDates: Date[] = [];
    @property({ type: Array })
    events: Array<{ date: Date; title: string }> = [];

    static get styles() {
        return css`
      :host {
        --col-cal-day-bg: #ffffff;
        --calendar-border: #e0e0e0;
        --col-cal-day-selected-bg: #007bff;
        --col-cal-day-selected-color: #ffffff;
        --col-cal-day-hover-bg: #f0f0f0;
        --disabled-date-color: #cccccc;
        --font-family: "Arial", sans-serif;
        --font-size: 14px;
        --padding: 16px;
        --spacing: 4px;
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
        background: var(--col-cal-day-hover-bg);
      }

      .day.selected {
        background: var(--col-cal-day-selected-bg);
        color: var(--col-cal-day-selected-color);
      }

      .day.disabled {
        color: var(--disabled-date-color);
        cursor: default;
      }
    `;
    }

    private getPrevMonthDays(month: Date): Date[] {
        const start = startOfMonth(month);
        const firstDay = getDay(start);
        const daysBefore = (firstDay - this.firstDayOfWeek + 7) % 7;
        if (daysBefore === 0) {
            return [];
        }
        const prevMonthStart = subDays(start, daysBefore);
        return eachDayOfInterval({
            start: prevMonthStart,
            end: subDays(start, 1),
        });
    }

    private getNextMonthDays(month: Date): Date[] {
        const end = endOfMonth(month);
        const nextMonthStart = addDays(end, 1);
        const firstDayOfNext = getDay(nextMonthStart);

        const daysAfter =
            (7 - ((firstDayOfNext - this.firstDayOfWeek + 7) % 7)) % 7;

        if (daysAfter === 0) {
            return [];
        }

        const nextMonthEnd = addDays(nextMonthStart, daysAfter - 1);

        return eachDayOfInterval({
            start: nextMonthStart,
            end: nextMonthEnd,
        });
    }

    private getMonthDays() {
        if (!this.month) return null;

        const month = this.month;
        const currentMonthDays = eachDayOfInterval({
            start: startOfMonth(month),
            end: endOfMonth(month),
        });

        this.disabledDates = [
            ...this.getPrevMonthDays(month),
            ...this.getNextMonthDays(month),
        ];

        return [
            ...this.getPrevMonthDays(month),
            ...currentMonthDays,
            ...this.getNextMonthDays(month),
        ];
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
        if (days) {
            return html`
          <div class="week">
            ${days.map((date) => {
                const isSelected =
                    isSameMonth(date, this.selectedDate as Date) &&
                    isSameDay(date, this.selectedDate as Date);

                const isDisabled = this.isDateDisabled(date);
                return html`
                <button
                  class="day ${isSelected ? "selected" : ""} ${isDisabled
                        ? "disabled"
                        : ""}"
                  @click=${() => this.handleDateSelect(date)}
                  aria-label=${format(date, "PPP", {
                            locale: new LocaleUtils(this.locale).currentLocale(),
                        })}
                  role="gridcell"
                >
                  ${date.getDate()}
                </button>
              `;
            })}
          </div>
      `;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "col-cal-date": ColCalDate;
    }
}
