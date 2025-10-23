import { addMonths, format, isAfter, isBefore, subMonths } from "date-fns";
import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getWeeks } from "./date.utils";
import { LocaleUtils } from "./locale.utils";

@customElement("col-cal-header")
export class ColCalHeader extends LitElement {
  static styles = css`
    :host {
      --col-cal-header-padding: 0;
      --col-cal-header-days-font-weight: regular;
      --col-cal-header-days-color: #757d8a;
      --col-cal-header-days-font-size: 12px;
      --col-cal-header-button-color-hover: #77a6ff;
      --col-cal-header-buttons-disabled-color: #a6a3ad;
      --col-cal-header-background-color: #ecf3ff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      padding: var(--col-cal-header-padding, 0.5rem);
    }
    .header__buttons {
      & button {
        background: none;
        border: none;
        cursor: pointer;
        &:hover {
          color: var(--col-cal-header-button-color-hover);
          background-clor: var(--col-cal-header-background-color);
        }
        &:disabled {
          color: var(--col-cal-header-buttons-disabled-color, black);
          &:hover {
            color: var(--col-cal-header-buttons-disabled-color, black);
          }
        }
      }
    }
    .week {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: var(--col-cal-text-align, center);
      padding-block: var(--col-cal-header-padding-vertical, 1rem);
    }
    .day-header {
      font-size: var(--col-cal-header-days-font-size, 12px);
      color: var(--col-cal-header-days-color, black);
      font-weight: var(--col-cal-header-days-font-weight, regular);
    }
  `;
  @property({ type: String }) locale: string = "en-US";
  @property({ type: String }) dataTestid: string = "ColCal-Header";
  @property({ type: Object }) date: Date | null = null;

  @property({ type: Object }) minDate: Date | null = null;
  @property({ type: Object }) maxDate: Date | null = null;

  @state()
  private _date: Date = this.date ?? new Date();

  handleChangeMonth() {
    this.dispatchEvent(
      new CustomEvent("change-month", {
        detail: this._date,
        bubbles: true,
        composed: true,
      }),
    );
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (this.date !== null) {
      this._date = this.date;
    } else {
      this._date = new Date();
    }
  }

  updated(): void {
    if (this.date !== null) {
      this._date = this.date;
    } else {
      this._date = new Date();
    }
  }

  private isDateMinDisabled(date: Date | null) {
    if (date === null) return false;
    if (this.minDate && isBefore(date, this.minDate)) {
      return true;
    }
  }

  private isDateMaxDisabled(date: Date | null) {
    if (date === null) return false;
    if (this.maxDate && isAfter(date, this.maxDate)) {
      return true;
    }
  }

  render() {
    return html`
      <div class="header" part="header"
        .data-testid="${this.dataTestid}"
      >
        <slot class="header__date" name="header-date" part="header-date"
        .data-testid="${`${this.dataTestid}-HeaderDate`}"
          >
          ${format(this._date, "MMMM yyyy", {
            locale: new LocaleUtils(this.locale).currentLocale(),
          })}
        </slot>
        <div class="header__buttons"
        .data-testid="${`${this.dataTestid}-Header-Buttons`}"
          >
          <button
            part="left-button"
            class="left-button"
            ?disabled="${this.isDateMinDisabled(this.date)}"
        .data-testid="${`${this.dataTestid}-Header-LeftButton`}"
            @click=${() => {
              this._date = subMonths(this._date, 1);
              this.handleChangeMonth();
            }}
          >
            <slot name="icon-left-button"
        .data-testid="${`${this.dataTestid}-Header-IconLeftButton`}"
                  > &lt; </slot>
          </button>
          <button
            class="right-button"
            part="right-button"
        .data-testid="${`${this.dataTestid}-Header-IconRightButton`}"
            ?disabled="${this.isDateMaxDisabled(this.date)}"
            @click=${() => {
              this._date = addMonths(this._date, 1);
              this.handleChangeMonth();
            }}
          >
            <slot name="icon-right-button"
        .data-testid="${`${this.dataTestid}-Header-IconRight`}"
                  > &gt; </slot>
          </button>
        </div>
      </div>

      <div class="week"
        .data-testid="${`${this.dataTestid}-Header-Week`}"
      >
        ${getWeeks(this.locale).map(
          (dayWeek) => html`<span class="day-header"
        .data-testid="${`${this.dataTestid}-Header-DayHeader`}"
          >${dayWeek}</span>`,
        )}
      </div>
    `;
  }
}
