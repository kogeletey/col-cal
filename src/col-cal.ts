import { LitElement, html } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import "@awesome.me/webawesome/dist/components/popover/popover.js";
import "./col-cal-header.ts";
import "./col-cal-dates.ts";
import "./col-cal-months.ts";
import "./col-cal-years.ts";
import type { MonthNumber } from "./col-cal.type.ts";
import { createDateFromMonthNumber, months } from "./date-utils.ts";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import type WaPopover from "@awesome.me/webawesome/dist/components/popover/popover.js";

@customElement("col-cal")
export class ColCal extends LitElement {
  @property({ type: Object }) date: Date = new Date();
  @property({ type: String }) locale: string = "en-US";
  @property({ type: Number }) firstDayOfWeek: number = 1;
  @property({ type: Array }) disabledDates: Date[] = [];
  @property({ type: Array }) events: Array<{ date: Date; title: string }> = [];

  @state()
  private _month: Date = this.date;

  private popoverYearsRef: Ref<HTMLElement> = createRef();
  private popoverMonthsRef: Ref<HTMLElement> = createRef();

  private get currentLocale(): "en" | "ru" {
    return this.locale.startsWith("ru") ? "ru" : "en";
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  private handleChangeMonth({ detail }: { detail: { month: MonthNumber } }) {
    this._month = createDateFromMonthNumber(
      detail.month,
      this._month.getFullYear(),
    );
    if (this.popoverMonthsRef.value) {
      (this.popoverMonthsRef.value as WaPopover).hide();
    }
  }

  private handleYearSelected({ detail }: { detail: { year: number } }) {
    this._month = new Date(
      this._month.getFullYear(),
      this._month.getMonth(),
      3,
    );
    this._month.setFullYear(detail.year);
    if (this.popoverYearsRef.value) {
      (this.popoverYearsRef.value as WaPopover).hide();
    }
  }

  private handleDateSelected(e: CustomEvent) {
    this.date = e.detail;
    this.dispatchEvent(
      new CustomEvent("date-selected", {
        detail: { date: this.date },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    return html`
      <style>
        .calendar {
          --calendar-bg: #ffffff;
          --calendar-border: #e0e0e0;
          --calendar-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: inline-block;
          position: relative;
          overflow: hidden;
          background: var(--calendar-bg);
          border: 1px solid var(--calendar-border);
          border-radius: var(--col-cal-border-radius, 8px);
          padding: 10px;
        }

        .calendar wa-popover {
          --arrow-size: 0;
        }
      </style>
      <div class="calendar">
        <col-cal-header
          .date=${this._month}
          .locale=${this.currentLocale}
          @change-month=${({ detail }: { detail: Date }) => {
            this._month = detail as Date;
          }}
        >
          <div slot="header-date">
            <button id="open-months-popup">
              ${months[this.currentLocale].at(
                this._month.getUTCMonth(),
              )}
            </button>
            <button id="open-years-popup">${this._month.getFullYear()}</button>
          </div>
        </col-cal-header>

        <wa-popover
          position="bottom"
          for="open-months-popup"
          ${ref(this.popoverMonthsRef)}
        >
          <col-cal-months
            .selectedMonth=${this._month.getUTCMonth()}
            .locale=${this.currentLocale}
            @change-month="${this.handleChangeMonth}"
          ></col-cal-months>
        </wa-popover>
        <wa-popover
          ${ref(this.popoverYearsRef)}
          position="bottom"
          for="open-years-popup"
        >
          <col-cal-years
            .selectedYear=${this._month.getUTCFullYear()}
            @change-year=${this.handleYearSelected}
          ></col-cal-years>
        </wa-popover>

        <col-cal-dates
          .month=${this._month}
          .selectedDate=${this.date}
          .locale=${this.currentLocale}
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
