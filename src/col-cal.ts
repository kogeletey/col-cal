import { LitElement, html } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import "@awesome.me/webawesome/dist/components/popover/popover.js";
import "./col-cal-header.ts";
import "./col-cal-dates.ts";
import "./col-cal-months.ts";
import "./col-cal-years.ts";
import type { MonthNumber } from "./col-cal.type.ts";
import { createDateFromMonthNumber, months } from "./date.utils.ts";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import type WaPopover from "@awesome.me/webawesome/dist/components/popover/popover.js";
import { insertSlotsByName } from "./lightdom.utils.ts";

@customElement("col-cal")
export class ColCal extends LitElement {
  @property({ type: Object }) date: Date = new Date();
  @property({ type: Object }) minDate: Date | null = null;
  @property({ type: Object }) maxDate: Date | null = null;

  @property({ type: String }) locale: string = "en-US";
  @property({ type: Number }) firstDayOfWeek: number = 1;
  @property({ type: Array }) disabledDates: Date[] = [];
  @property({ type: Array }) events: Array<{ date: Date; title: string }> = [];

  @state()
  private _date: Date = this.date;

  private popoverYearsRef: Ref<HTMLElement> = createRef();
  private popoverMonthsRef: Ref<HTMLElement> = createRef();

  private get currentLocale(): "en" | "ru" {
    return this.locale.startsWith("ru") ? "ru" : "en";
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (this.date !== null) {
      this._date = this.date;
    } else {
      this._date = new Date();
    }

    requestAnimationFrame(() => {
      insertSlotsByName(this);
    });
  }

  updated(): void {
    requestAnimationFrame(() => {
      insertSlotsByName(this);
    });
  }

  private handleChangeMonth({ detail }: { detail: { month: MonthNumber } }) {
    this._date = createDateFromMonthNumber(
      detail.month,
      this._date.getFullYear(),
    );
    if (this.popoverMonthsRef.value) {
      (this.popoverMonthsRef.value as WaPopover).hide();
    }
  }

  private handleYearSelected({ detail }: { detail: { year: number } }) {
    this._date = new Date(this._date.getFullYear(), this._date.getMonth(), 3);
    this._date.setFullYear(detail.year);
    if (this.popoverYearsRef.value) {
      (this.popoverYearsRef.value as WaPopover).hide();
    }
  }

  private handleMonthsChange() {
    this.dispatchEvent(
      new CustomEvent("show-months", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleYearsChange() {
    this.dispatchEvent(
      new CustomEvent("show-years", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleDateSelected(e: CustomEvent) {
    this.date = e.detail;
    this.dispatchEvent(
      new CustomEvent("change-date", {
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
          --col-cal-bg: #ffffff;
          --col-cal-radius: 10px;
          --col-cal-padding: 12px;
          --col-cal-shadow: 0px 4px 9.8px 0px #0000000d;
          display: inline-block;
          position: relative;
          overflow: hidden;
          background: var(--calendar-bg);
          border-radius: var(--col-cal-radius, 8px);
          box-shadow: var(--col-cal-shadow);
          padding: var(--col-cal-padding, 0.5rem);
        }

        .calendar wa-popover {
          --arrow-size: 0;
          --max-width: fit-content;
        }
        .calendar col-cal-months {
          margin-left: 10px;
        }
        .calendar col-cal-years {
          margin-left: 70px;
        }
        .calendar .calendar__header-date {
          display: flex;
          gap: 15px;
          & button {
            apperance: none;
            background: none;
            outline: 0;
            border: 0;
            color: var(--col-cal-header-button-color);
            font-weight: var(--col-cal-header-font-weight, bold);
          }
        }
      </style>
      <div class="calendar">
        <col-cal-header
          .date=${this._date}
          .locale=${this.currentLocale}
          .minDate=${this.minDate}
          .maxDate=${this.maxDate}
          @change-month=${({ detail }: { detail: Date }) => {
            this._date = detail as Date;
          }}
        >
          <div slot="header-date" class="calendar__header-date">
            <button id="open-months-popup">
              ${months[this.currentLocale].at(this._date.getUTCMonth())}
              <div name="months-popup-icon"></div>
            </button>
            <button id="open-years-popup">
              ${this._date.getFullYear()}
              <div name="years-popup-icon"></div>
            </button>
          </div>
          <div name="icon-left-button" slot="icon-left-button">&lt;</div>
          <div name="icon-right-button" slot="icon-right-button">&gt;</div>
        </col-cal-header>

        <wa-popover
          ${ref(this.popoverMonthsRef)}
          position="bottom"
          for="open-months-popup"
          @wa-show="${this.handleMonthsChange}"
          @wa-hide="${this.handleMonthsChange}"
        >
          <col-cal-months
            .year="${this._date.getUTCFullYear()}"
            .selectedMonth=${this._date.getUTCMonth()}
            .minMonth=${this.minDate}
            .maxMonth=${this.maxDate}
            .locale=${this.currentLocale}
            @change-month="${this.handleChangeMonth}"
          ></col-cal-months>
        </wa-popover>
        <wa-popover
          ${ref(this.popoverYearsRef)}
          position="bottom"
          for="open-years-popup"
          @wa-show="${this.handleYearsChange}"
          @wa-hide="${this.handleYearsChange}"
        >
          <col-cal-years
            .selectedYear=${this._date.getUTCFullYear()}
            .minYear=${this.minDate?.getUTCFullYear()}
            .maxYear=${this.maxDate?.getUTCFullYear()}
            @change-year=${this.handleYearSelected}
          >
            <div slot="icon-left-button" name="years-icon-left">&lt;</div>
            <div slot="icon-right-button" name="years-icon-right">&gt;</div>
          </col-cal-years>
        </wa-popover>

        <col-cal-dates
          .month=${this._date}
          .minDate=${this.minDate}
          .maxDate=${this.maxDate}
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
