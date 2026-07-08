import { LitElement, html, type PropertyValues } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import "@awesome.me/webawesome/dist/components/popover/popover.js";
import "./col-cal-header.ts";
import "./col-cal-dates.ts";
import "./col-cal-months.ts";
import "./col-cal-years.ts";
import type { MonthNumber } from "./col-cal.type.ts";
import { createDateFromMonthNumber, getMonths } from "./date.utils.ts";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import type WaPopover from "@awesome.me/webawesome/dist/components/popover/popover.js";
import { insertSlotsByName } from "./lightdom.utils.ts";

@customElement("col-cal")
export class ColCal extends LitElement {
    @property({ type: Object }) date: Date = new Date();
    @property({ type: Object }) minDate: Date | null = null;
    @property({ type: Object }) maxDate: Date | null = null;

    @property({ type: String }) locale: string = "en-US";
    @property({ type: String }) dataTestid: string = "ColCal";
    @property({ type: Number }) firstDayOfWeek: number = 1;
    @property({ type: Array }) disabledDates: Date[] = [];
    @property({ type: Array }) events: Array<{ date: Date; title: string }> = [];

    @state()
    private _date: Date = this.date;
    private _monthsButtonId: string = "open-months-popup";
    private _yearsButtonId: string = "open-years-popup";
    private _isMonthsOpen: boolean = false;
    private _isYearsOpen: boolean = false;
    private _dateGridMinDate: Date | null = null;
    private _dateGridMaxDate: Date | null = null;
    private _isDateGridBoundsInitialized: boolean = false;

    private popoverYearsRef: Ref<HTMLElement> = createRef();
    private popoverMonthsRef: Ref<HTMLElement> = createRef();

    private get currentLocale(): string {
        return this.locale;
    }

    protected createRenderRoot(): HTMLElement | DocumentFragment {
        return this;
    }

    private get isSelectorOpen(): boolean {
        return this._isMonthsOpen || this._isYearsOpen;
    }

    private get dateGridMinDate(): Date | null {
        return this._isDateGridBoundsInitialized
            ? this._dateGridMinDate
            : this.minDate;
    }

    private get dateGridMaxDate(): Date | null {
        return this._isDateGridBoundsInitialized
            ? this._dateGridMaxDate
            : this.maxDate;
    }

    private syncDateGridBounds(): void {
        this._dateGridMinDate = this.minDate;
        this._dateGridMaxDate = this.maxDate;
        this._isDateGridBoundsInitialized = true;
    }

    private generateUniqueButtonId(prefix: string) {
        if (typeof crypto !== "undefined" && crypto.randomUUID) {
            return prefix + crypto.randomUUID().substring(0, 5);
        }

        const randomPart =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        return prefix + randomPart;
    }

    connectedCallback(): void {
        super.connectedCallback();

        if (this.date !== null) {
            this._date = this.date;
        } else {
            this._date = new Date();
        }

        this._monthsButtonId = this.generateUniqueButtonId(this._monthsButtonId);
        this._yearsButtonId = this.generateUniqueButtonId(this._yearsButtonId);

        requestAnimationFrame(() => {
            insertSlotsByName(this);
        });
    }

    updated(): void {
        requestAnimationFrame(() => {
            insertSlotsByName(this);
        });
    }

    protected willUpdate(changedProperties: PropertyValues<this>): void {
        if (
            !this.isSelectorOpen &&
            (!this._isDateGridBoundsInitialized ||
                changedProperties.has("minDate") ||
                changedProperties.has("maxDate"))
        ) {
            this.syncDateGridBounds();
        }
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
        const wasSelectorOpen = this.isSelectorOpen;
        this._isMonthsOpen = true;
        this._isYearsOpen = false;
        if (!wasSelectorOpen) this.syncDateGridBounds();

        this.dispatchEvent(
            new CustomEvent("show-months", {
                bubbles: true,
                composed: true,
            }),
        );
    }

    private handleYearsChange() {
        const wasSelectorOpen = this.isSelectorOpen;
        this._isYearsOpen = true;
        this._isMonthsOpen = false;
        if (!wasSelectorOpen) this.syncDateGridBounds();

        this.dispatchEvent(
            new CustomEvent("show-years", {
                bubbles: true,
                composed: true,
            }),
        );
    }

    private handleYearsHideChange() {
        this._isYearsOpen = false;

        this.dispatchEvent(
            new CustomEvent("hide-years", {
                bubbles: true,
                composed: true,
            }),
        );
    }

    private handleMonthsHideChange() {
        this._isMonthsOpen = false;

        this.dispatchEvent(
            new CustomEvent("hide-months", {
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
            appearance: none;
            background: none;
            outline: 0;
            border: 0;
            color: var(--col-cal-header-button-color);
            font-weight: var(--col-cal-header-font-weight, bold);
          }
        }
      </style>
      <div class="calendar" data-testid="${this.dataTestid}">
        <col-cal-header
          .date=${this._date}
          .locale=${this.currentLocale}
          .minDate=${this.minDate}
          .maxDate=${this.maxDate}
          .dataTestid="${`${this.dataTestid}-Header`}"
          @change-month=${({ detail }: { detail: Date }) => {
                this._date = detail as Date;
            }}
        >
          <div slot="header-date" class="calendar__header-date"
          data-testid="${`${this.dataTestid}-Header-Date`}"
              >
            <button id="${this._monthsButtonId}" class="popup"
          data-testid="${`${this.dataTestid}-Months`}"
                  >
              ${getMonths(this.currentLocale).at(this._date.getMonth())}
              <div name="months-popup-icon"
          data-testid="${`${this.dataTestid}-MonthsIcon`}"
                      ></div>
            </button>
            <button id="${this._yearsButtonId}" class="popup"
          data-testid="${`${this.dataTestid}-Years`}"
                  >
              ${this._date.getFullYear()}
              <div name="years-popup-icon"
                data-testid="${`${this.dataTestid}-YearsIcon`}"
                      ></div>
            </button>
          </div>
          <div
            part="icon-button"
            name="icon-left-button"
            slot="icon-left-button"
            data-testid="${`${this.dataTestid}-IconsLeftYear`}"
          >
            &lt;
          </div>
          <div
            part="icon-button"
            name="icon-right-button"
            slot="icon-right-button"
            data-testid="${`${this.dataTestid}-IconsRightYear`}"
          >
            &gt;
          </div>
        </col-cal-header>

        <wa-popover
          ${ref(this.popoverMonthsRef)}
          position="bottom"
          for="${this._monthsButtonId}"
          data-testid="${`${this.dataTestid}-Popover-Months`}"
          @wa-show="${this.handleMonthsChange}"
          @wa-after-hide="${this.handleMonthsHideChange}"
        >
          <col-cal-months
            dataTestid="${`${this.dataTestid}-Months`}"
            .year="${this._date.getFullYear()}"
            .selectedMonth=${this._date.getMonth()}
            .minMonth=${this.minDate}
            .maxMonth=${this.maxDate}
            .locale=${this.currentLocale}
            @change-month="${this.handleChangeMonth}"
          ></col-cal-months>
        </wa-popover>
        <wa-popover
          ${ref(this.popoverYearsRef)}
          position="bottom"
          for="${this._yearsButtonId}"
          data-testid="${`${this.dataTestid}-Popover-Years`}"
          @wa-show="${this.handleYearsChange}"
          @wa-after-hide="${this.handleYearsHideChange}"
        >
          <col-cal-years
            .dataTestid="${`${this.dataTestid}-Years`}"
            .selectedYear=${this._date.getFullYear()}
            .minYear=${this.minDate?.getFullYear()}
            .maxYear=${this.maxDate?.getFullYear()}
            @change-year=${this.handleYearSelected}
          >
            <div
              part="years-arrow-icon"
              slot="icon-left-button"
              name="years-icon-left"
              data-testid="${`${this.dataTestid}-LeftButton`}"
            >
              &lt;
            </div>
            <div
              part="years-arrow-icon"
              slot="icon-right-button"
              name="years-icon-right"
              data-testid="${`${this.dataTestid}-RightButton`}"
            >
              &gt;
            </div>
          </col-cal-years>
        </wa-popover>

        <col-cal-dates
          .dataTestid="${`${this.dataTestid}-Dates`}"
          .month=${this._date}
          .minDate=${this.dateGridMinDate}
          .maxDate=${this.dateGridMaxDate}
          .selectedDate=${this.date}
          .locale=${this.currentLocale}
          .firstDayOfWeek=${this.firstDayOfWeek}
          .disabledDates=${this.disabledDates}
          .events=${this.events}
          @change-date=${this.handleDateSelected}
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
