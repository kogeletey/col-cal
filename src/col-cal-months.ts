import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("col-cal-months")
export class ColCalMonths extends LitElement {
  @property({ type: String }) selectedMonth = "";
  @property({ type: String }) locale: "en" | "ru" = "en";

  private translations = {
    en: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    ru: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
    ],
  };

  static get styles() {
    return css`
      .month-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        padding: 10px;
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

  render() {
    return html`
      <div class="month-grid">
        ${this.translations[this.locale].map(
          (month) =>
            html`<div
              class="month-cell ${this.selectedMonth === month
                ? "selected"
                : ""}"
              @click=${() => this.handleMonthSelect(month)}
              aria-selected=${this.selectedMonth === month}
            >
              ${month}
            </div>`,
        )}
      </div>
    `;
  }

  handleMonthSelect(month: string) {
    this.selectedMonth = month;
    this.dispatchEvent(
      new CustomEvent("month-selected", {
        detail: { month: this.selectedMonth },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "col-cal-months": ColCalMonths;
  }
}
