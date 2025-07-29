import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { MonthNumber } from "./col-cal.type.ts";
import { months } from "./date-utils.ts";

@customElement("col-cal-months")
export class ColCalMonths extends LitElement {
  @property({ type: Number }) selectedMonth: MonthNumber | null = null;
  @property({ type: Number }) disabledMonth: MonthNumber | null = null;
  @property({ type: String }) locale: "en" | "ru" = "en";

  static get styles() {
    return css`
      :host {
        --col-cal-months-padding: 12px;
        --col-cal-months-gap: 12px;
        --col-cal-months-cell-padding: 8px;
        --col-cal-months-cell-radius: 16px;
        --col-cal-months-cell-selected: #77a6ff;
        --col-cal-months-cell-hover: #f2f7ff;
        --col-cal-months-border-color: #9cbeff;
      }
      .month-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border-width: var(--col-cal-months-border-width, 1px);
        border-style: solid;
        border-color: var(--col-cal-months-border-color, black);
        gap: var(--col-cal-months-gap, 1rem);
        padding: var(--col-cal-months-padding, 1rem);
        background: var(--col-cal-bg);
      }

      .month-cell {
        text-align: var(--col-cal-text-align, center);
        font-size: var(--col-cal-months-cell-color, 12px);
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
    return months[this.locale].indexOf(month) as MonthNumber;
  }

  private isSelected(month: string): boolean {
    return this.selectedMonth === this.getFromIndexMonth(month);
  }

  private isDisabled(month: string): boolean {
    return this.disabledMonth === this.getFromIndexMonth(month);
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
        ${months[this.locale].map(
          (month: string) =>
            html`<div
              part="month"
              class="month-cell
              ${this.isSelected(month) ? "selected" : ""}
              ${this.isDisabled(month) ? "disabled" : ""}
              "
              @click=${() => this.handleMonthSelect(month)}
              aria-selected=${this.isSelected(month)}
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
