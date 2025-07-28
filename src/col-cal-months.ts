import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { MonthNumber } from "./col-cal.type.ts";
import { months } from "./date-utils.ts";

@customElement("col-cal-months")
export class ColCalMonths extends LitElement {
  @property({ type: Number }) selectedMonth: MonthNumber | null = null;
  @property({ type: String }) locale: "en" | "ru" = "en";

  static get styles() {
    return css`
      .month-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        padding: 10px;
        background: var(--calendar-bg);
        border: 1px solid #ccc;
        font-family: Arial, sans-serif;
      }

      .month-cell {
        padding: 15px;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .month-cell.selected {
        background-color: #007bff;
        color: white;
        font-weight: bold;
      }
    `;
  }

  private getFromIndexMonth(month: string): MonthNumber {
    return months[this.locale].indexOf(month) as MonthNumber;
  }

  private isSelected(month: string): boolean {
    return this.selectedMonth === this.getFromIndexMonth(month);
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
      <div class="month-grid">
        ${months[this.locale].map(
          (month: string) =>
            html`<div
              class="month-cell ${this.isSelected(month) ? "selected" : ""}"
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
