import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("col-cal-years")
export class ColCalYears extends LitElement {
  @property({ type: Number }) selectedYear: number | null = null;

  @state()
  private _startYear: number = 2005;
  private _chunkSize = 12;

  static get styles() {
    return css`
      .year-grid {
        display: grid;
        gap: 10px;
        padding: 10px;
        background: #fff;
      }

      .years {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
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
        justify-content: center;
        gap: 10px;
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

  connectedCallback() {
    super.connectedCallback();
    this.initializeStartYear();
  }

  private initializeStartYear() {
    let centerYear = 2023;
    if (this.selectedYear && !isNaN(Number(this.selectedYear))) {
      centerYear = Number(this.selectedYear);
    }

    this._startYear = centerYear - 3;
  }

  private get fullYears() {
    return Array.from({ length: this._chunkSize }, (_, i) =>
      (this._startYear + i).toString(),
    );
  }

  private handlePrev() {
    this._startYear -= this._chunkSize;
  }

  private handleNext() {
    this._startYear += this._chunkSize;
  }

  private isSelectedYear(year: string): boolean {
    return this.selectedYear === Number(year);
  }

  private handleYearSelect(year: number) {
    this.selectedYear = year;
    this.dispatchEvent(
      new CustomEvent("change-year", {
        detail: { year: year },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    return html`
      <div class="year-grid">
        <div class="navigation">
          <button @click=${this.handlePrev}>
            <slot name="icon-left-button"> &lt; </slot>
          </button>

          <button @click=${this.handleNext}>
            <slot name="icon-right-button"> &gt; </slot>
          </button>
        </div>

        <div class="years">
          ${this.fullYears.map(
            (year) =>
              html`<div
                class="year-cell ${this.isSelectedYear(year) ? "selected" : ""}"
                @click=${() => this.handleYearSelect(Number(year))}
                aria-selected=${this.isSelectedYear(year)}
              >
                ${year}
              </div>`,
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "col-cal-years": ColCalYears;
  }
}
