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
      :host {
        --col-cal-years-cell-hover: #f2f7ff;
        --col-cal-years-padding: 12px;
        --col-cal-years-cell-radius: 16px;
        --col-cal-years-cell-padding: 7.5px 13.5px;
        --col-cal-years-cell-selected: #77a6ff;
        --col-cal-years-gap: 12px;
        --col-cal-years-border-color: #9cbeff;
      }
      .year-grid {
        display: grid;
        border-width: var(--col-cal-years-border-width, 1px);
        border-style: solid;
        padding: var(--col-cal-years-padding, 1rem);
        border-color: var(--col-cal-years-border-color, black);
        background: var(--col-cal-bg);
      }

      .years {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--col-cal-years-gap, 10px);
      }

      .year-cell {
        padding: var(--col-cal-years-cell-padding, 1rem);
        text-align: center;
        line-height: 100%;
        font-size: 12px;
        border-radius: var(--col-cal-years-cell-radius, 5px);
        &:hover {
          background-color: var(--col-cal-years-cell-hover);
        }
      }

      .year-cell.selected {
        background-color: var(--col-cal-years-cell-selected, black);
        color: var(--col-cal-years-cell-selected-color, white);
        font-weight: normal;
      }

      .navigation {
        display: flex;
        justify-content: center;
      }

      .navigation button {
        padding: 8px 16px;
        cursor: pointer;
        background: none;
        border: none;
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
