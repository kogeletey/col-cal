import { LitElement, html, css } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import "@awesome.me/webawesome/dist/components/popover/popover.js";
import "./col-cal-header.ts";
import "./col-cal-dates.ts";
import "./col-cal-months.ts";
import "./col-cal-years.ts";
import type { MonthNumber } from "./col-cal.type.ts";
import { createDateFromMonthNumber, months } from "./date-utils.ts";

@customElement("col-cal")
export class ColCal extends LitElement {
  @property({ type: Object }) date: Date = new Date();
  @property({ type: String }) locale: string = "en-US";
  @property({ type: Number }) firstDayOfWeek: number = 1;
  @property({ type: Array }) disabledDates: Date[] = [];
  @property({ type: Array }) events: Array<{ date: Date; title: string }> = [];

  @state()
  private _month: Date = this.date;

  static styles = css`
    :host {
      --calendar-bg: #ffffff;
      --calendar-border: #e0e0e0;
      --calendar-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: inline-block;
    }

    .calendar {
      position: relative;
      overflow: hidden;
      background: var(--calendar-bg);
      border: 1px solid var(--calendar-border);
      border-radius: var(--col-cal-border-radius, 8px);
      padding: 10px;
    }

    wa-popover {
      --arrow-size: 0;
    }
  `;

  private get currentLocale(): "en" | "ru" {
    return this.locale.startsWith("ru") ? "ru" : "en";
  }

  private handleChangeMonth({ detail }: { detail: { month: MonthNumber } }) {
    this._month = createDateFromMonthNumber(detail.month);
    console.log("get-a-this-month", this._month);
  }

  private handleYearSelected() {}

  private handleDateSelected(e: CustomEvent) {
    this.date = e.detail;
    this.dispatchEvent(
      new CustomEvent("date-selected", {
        detail: this.date,
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    return html`
      <div class="calendar">
        <col-cal-header
          .date=${this._month}
          .locale=${this.locale}
          @change-month=${({ detail }: { detail: Date }) => {
            this._month = detail as Date;
          }}
        >
          <div slot="header-date">
            <button id="open-months-popup">
              ${months[this.locale as "ru" | "en"].at(
                this._month.getUTCMonth(),
              )}
            </button>
            <button id="open-years-popup">2025</button>
          </div>
        </col-cal-header>

        <wa-popover position="bottom" for="open-months-popup">
          <col-cal-months
            .selectedMonth=${this._month.getUTCMonth()}
            @change-month="${this.handleChangeMonth}"
            locale=${this.currentLocale}
          ></col-cal-months>
        </wa-popover>
        <wa-popover position="bottom" for="open-years-popup">
          <col-cal-years
            .selectedYear=${this._month.getUTCFullYear()}
            .language=${this.currentLocale}
            @year-selected=${this.handleYearSelected}
          ></col-cal-years>
        </wa-popover>

        <col-cal-dates
          .month=${this._month}
          .selectedDate=${this.date}
          .locale=${this.locale}
          .firstDayOfWeek=${this.firstDayOfWeek}
          .disabledDates=${this.disabledDates}
          .events=${this.events}
          @date-selected=${this.handleDateSelected}
        ></col-cal-dates>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "col-cal": ColCal;
  }
}
