import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  type Locale,
} from "date-fns";
import "@awesome.me/webawesome/dist/components/popup/popup.js";
import { enUS, ru } from "date-fns/locale";

const LOCALE_MAP: Record<string, Locale> = {
  "en-US": enUS,
  // prettier-ignore
  "ru": ru,
};

@customElement("wa-calendar")
export class WaCalendar extends LitElement {
  static styles = css`
    :host {
      --primary-color: #2563eb;
      --text-color: #1f2937;
      --disabled-color: #6b7280;
      --hover-bg: #f3f4f6;
      display: block;
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
    }

    .day,
    .header-day {
      padding: 0.5rem;
      text-align: center;
      border-radius: 4px;
    }

    .day:not(.disabled):hover {
      background: var(--hover-bg);
      cursor: pointer;
    }

    .selected {
      background: var(--primary-color);
      color: white;
    }

    .disabled {
      color: var(--disabled-color);
      pointer-events: none;
    }

    .event-marker {
      width: 6px;
      height: 6px;
      background: var(--primary-color);
      border-radius: 50%;
      margin: 2px auto;
    }
  `;

  // Properties matching v-calendar patterns
  @property({ type: String }) view: "month" | "week" | "day" = "month";
  @property({ type: Date }) date = new Date();
  @property({ type: String }) locale = navigator.language || "EN-US";
  @property({ type: Number }) firstDayOfWeek = 1;
  @property({ type: Array }) disabledDates: Date[] = [];
  @property({ type: Date }) selectedDate: Date | null = null;
  @property({ type: Boolean }) showWeekNumbers = false;
  @property({ type: Array }) events: Array<{ date: Date; title: string }> = [];

  @state() private currentDate: Date = new Date();

  private currentLocale() {
    return LOCALE_MAP[this.locale] || enUS;
  }

  // v-calendar compatible event dispatch
  private dispatchDateChange(newDate: Date) {
    this.dispatchEvent(
      new CustomEvent("update:date", {
        detail: newDate,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleDateClick(date: Date) {
    if (this.isDateDisabled(date)) return;

    this.selectedDate = date;
    this.dispatchEvent(
      new CustomEvent("update:selectedDate", {
        detail: this.selectedDate,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private isDateDisabled(date: Date) {
    return this.disabledDates.some((d) => isSameDay(d, date));
  }

  private getEventsForDate(date: Date) {
    return this.events.filter((event) => isSameDay(event.date, date));
  }

  // Navigation controls compatible with v-calendar patterns
  private next() {
    this.currentDate =
      this.view === "month"
        ? addMonths(this.currentDate, 1)
        : this.view === "week"
          ? addWeeks(this.currentDate, 1)
          : this.currentDate;
    this.dispatchDateChange(this.currentDate);
  }

  private prev() {
    this.currentDate =
      this.view === "month"
        ? subMonths(this.currentDate, 1)
        : this.view === "week"
          ? subWeeks(this.currentDate, 1)
          : this.currentDate;
    this.dispatchDateChange(this.currentDate);
  }

  render() {
    const start = startOfMonth(this.currentDate);
    const end = endOfMonth(this.currentDate);
    const days = eachDayOfInterval({ start, end });

    return html`
      <div class="calendar">
        <div class="calendar-header">
          <button @click=${this.prev}>&lt;</button>
          <h3>
            ${format(this.currentDate, "MMMM yyyy", {
              locale: this.currentLocale(),
            })}
          </h3>
          <button @click=${this.next}>&gt;</button>
        </div>

        <div class="grid">
          ${this.renderWeekdays()} ${days.map((date) => this.renderDay(date))}
        </div>
      </div>
    `;
  }

  private renderWeekdays() {
    const weekdays = [];
    for (let i = 0; i < 7; i++) {
      const day = (i + this.firstDayOfWeek) % 7;
      weekdays.push(html`
        <div class="header-day">
          ${format(new Date(2023, 0, day + 1), "EEE", {
            locale: this.currentLocale(),
          })}
        </div>
      `);
    }
    return weekdays;
  }

  private renderDay(date: Date) {
    const isDisabled = this.isDateDisabled(date);
    const isSelected = this.selectedDate && isSameDay(date, this.selectedDate);
    const events = this.getEventsForDate(date);

    return html`
      <div
        class="day ${isDisabled ? "disabled" : ""} ${isSelected
          ? "selected"
          : ""}"
        @click=${() => this.handleDateClick(date)}
        aria-selected=${isSelected}
        role="gridcell"
      >
        ${format(date, "d")}
        ${events.length > 0
          ? html`
              <wa-popup .position=${"top"} .hover=${true}>
                <div slot="content">
                  ${events.map((event) => html`<div>${event.title}</div>`)}
                </div>
                <div class="event-marker"></div>
              </wa-popup>
            `
          : ""}
      </div>
    `;
  }
}
