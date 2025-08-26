import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { MonthNumber } from "./col-cal.type.ts";
import { getMonths } from "./date.utils.ts";
import { isAfter, isBefore } from "date-fns";

@customElement("col-cal-months")
export class ColCalMonths extends LitElement {
  @property({ type: Number }) selectedMonth: MonthNumber | null = null;
  @property({ type: Array }) disabledMonths: MonthNumber[] | null = null;
  @property({ type: Number }) year: number = new Date().getFullYear();

  @property({ type: Object }) minMonth: Date | null = null;
  @property({ type: Object }) maxMonth: Date | null = null;

  @property({ type: String }) locale: string = "en-US";

  static get styles() {
    return css`
      :host {
        --col-cal-months-padding: 12px;
        --col-cal-months-gap: 12px;
        --col-cal-months-border-radius: 5px;
        --col-cal-months-cell-padding: 9px 18.5px;
        --col-cal-months-cell-radius: 16px;
        --col-cal-months-cell-selected-color: #77a6ff;
        --col-cal-months-cell-selected: #f2f7ff;
        --col-cal-months-cell-hover: #77a6ff;
        --col-cal-months-border-color: #9cbeff;
      }
      .month-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        border-width: var(--col-cal-months-border-width, 1px);
        border-style: solid;
        border-color: var(--col-cal-months-border-color, black);
        border-radius: var(--col-cal-months-border-radius, 0);
        gap: var(--col-cal-months-gap, 1rem);
        padding: var(--col-cal-months-padding, 1rem);
        background: var(--col-cal-bg);
      }

      .month-cell {
        text-align: var(--col-cal-text-align, center);
        font-size: var(--col-cal-months-cell-font-size, 12px);
        line-height: 100%;
        padding: var(--col-cal-months-cell-padding, 15px);
        border-radius: var(--col-cal-months-cell-radius, 5px);
        &:hover {
          background-color: var(--col-cal-months-cell-hover, cyan);
        }
      }

      .month-cell.selected {
        cursor: pointer;
        background-color: var(--col-cal-months-cell-selected, blue);
        color: var(--col-cal-months-cell-selected-color, white);
        font-weight: var(--col-cal-months-cell-font-weight, regular);
      }
    `;
  }

  private getFromIndexMonth(month: string): MonthNumber {
    return getMonths(this.locale).indexOf(month) as MonthNumber;
  }

  private isSelected(month: string): boolean {
    return this.selectedMonth === this.getFromIndexMonth(month);
  }

  private isDisabled(month: string): boolean {
    const monthIndex = this.getFromIndexMonth(month);
    if (this.minMonth) {
      const monthDate = new Date(this.year, monthIndex, this.minMonth.getDay());

      if (isBefore(monthDate, this.minMonth)) {
        return true;
      }
    }

    if (this.maxMonth) {
      const monthDate = new Date(this.year, monthIndex, this.maxMonth.getDay());

      if (isAfter(monthDate, this.maxMonth)) {
        return true;
      }
    }

    return this.disabledMonths?.includes(monthIndex) ?? false;
  }

  private handleMonthSelect(month: string) {
    this.dispatchEvent(
      new CustomEvent("change-month", {
        detail: { month: this.getFromIndexMonth(month) },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    return html`
      <div class="month-grid" part="months">
        ${getMonths(this.locale).map(
          (month: string) =>
            html`<div
              part="month"
              class="month-cell
              ${this.isSelected(month) ? "selected" : ""}
              ${this.isDisabled(month) && !this.isSelected(month)
                ? "disabled"
                : ""}
              "
              @click=${() => {
                if (!this.isDisabled(month)) this.handleMonthSelect(month);
              }}
              aria-selected=${this.isSelected(month)}
              part="month ${this.isDisabled(month) && !this.isSelected(month)
                ? "disabled"
                : ""}
            "
            >
              ${month}
            </div>`,
        )}
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "col-cal-months": ColCalMonths;
  }
}
