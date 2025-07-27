import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("col-cal-years")
export class ColCalYears extends LitElement {
  @property({ type: String }) selectedYear = "";
  @property({ type: String }) language = "en";
  @property({ type: Number }) currentPage = 0;

  // Configuration for year range
  private startYear = 1950;
  private endYear = 2023;

  // Translations for labels
  private translations = {
    en: { prev: "Previous", next: "Next", label: "Year" },
    ru: { prev: "Предыдущий", next: "Следующий", label: "Год" },
  };

  // Generate full list of years
  private get fullYears() {
    return Array.from({ length: this.endYear - this.startYear + 1 }, (_, i) =>
      (this.startYear + i).toString(),
    );
  }

  private get pageYears() {
    const start = this.currentPage * 12;
    const end = start + 12;
    return this.fullYears.slice(start, end);
  }

  private get totalPages() {
    return Math.ceil(this.fullYears.length / 12);
  }

  static get styles() {
    return css`
      .year-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        padding: 10px;
        font-family: Arial, sans-serif;
      }

      .year-cell {
        padding: 15px;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.2s;
      }

      .year-cell.selected {
        background-color: #007bff;
        color: white;
        font-weight: bold;
      }

      .navigation {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
      }

      .navigation button {
        padding: 8px 16px;
        cursor: pointer;
        border: none;
        background: #f0f0f0;
        border-radius: 4px;
      }

      .navigation button:disabled {
        background: #e0e0e0;
        cursor: not-allowed;
      }

      .label {
        font-weight: bold;
        margin-bottom: 10px;
        display: block;
      }
    `;
  }

  render() {
    return html`
      <div class="year-grid">
        <div class="label">${this.translations[this.language].label}</div>

        <div class="navigation">
          <button @click=${this.handlePrev} ?disabled=${this.currentPage === 0}>
            ${this.translations[this.language].prev}
          </button>

          <button
            @click=${this.handleNext}
            ?disabled=${this.currentPage === this.totalPages - 1}
          >
            ${this.translations[this.language].next}
          </button>
        </div>

        ${this.pageYears.map(
          (year) =>
            html`<div
              class="year-cell ${this.selectedYear === year ? "selected" : ""}"
              @click=${() => this.handleYearSelect(year)}
              aria-selected=${this.selectedYear === year}
            >
              ${year}
            </div>`,
        )}
      </div>
    `;
  }

  handlePrev() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  handleNext() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  handleYearSelect(year: string) {
    this.selectedYear = year;
    this.dispatchEvent(
      new CustomEvent("year-selected", {
        detail: { year: this.selectedYear },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "col-cal-years": ColCalYears;
  }
}
