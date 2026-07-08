import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("col-cal-years")
export class ColCalYears extends LitElement {
  @property({ type: Number }) selectedYear: number | null = null;

  @property({ type: Object }) minYear: number | null = null;
  @property({ type: Object }) maxYear: number | null = null;

  @property({ type: Array }) disabledYears: number[] = [];
  @property({ type: String }) dataTestid: string = "ColCal-Years";

  @state()
  private _startYear: number = 2005;
  private _chunkSize = 12;

  static get styles() {
    return css`
      :host {
        --col-cal-years-padding: 12px;
        --col-cal-years-border-radius: 5px;
        --col-cal-years-cell-radius: 16px;
        --col-cal-years-cell-padding: 7.5px 13.5px;
        --col-cal-years-cell-selected: #f2f7ff;
        --col-cal-years-cell-selected-color: #77a6ff;
        --col-cal-years-gap: 12px;
        --col-cal-years-cell-hover: #77a6ff;
        --col-cal-years-border-color: #9cbeff;
      }
      .year-grid {
        display: grid;
        border-width: var(--col-cal-years-border-width, 1px);
        border-style: solid;
        border-radius: var(--col-cal-years-border-radius, 0);
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
        font-size: var(--col-cal-years-cell-font-size, 12px);
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

      .year-cell.disabled {
        cursor: normal;
        color: var(--col-cal-years-disabled-color);
        background-color: var(--col-years-disabled-bg-color, transparent);
      }

      .navigation {
        display: flex;
        padding: var(--col-cal-years-buttons-padding, 8px);
        gap: var(--col-cal-years-buttons-gap, 0px);
        justify-content: center;
      }

      .navigation button {
        cursor: pointer;
        padding: 0;
        outline: 0;
        background: none;
        border: none;
      }

      .navigation button:disabled {
        background: var(--col-cal-years-buttons-disabled-bg);
        color: var(--col-cal-years-buttons-disabled-color);
        cursor: not-allowed;
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

  private isYearDisabled(year: number): boolean {
    if (this.minYear && year < this.minYear) {
      return true;
    }
    if (this.maxYear && year > this.maxYear) {
      return true;
    }
    return this.disabledYears.includes(year);
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
      <div class="year-grid"
      part="years"
              data-testid="${`${this.dataTestid}-Grid`}"
      >
        <div class="navigation"
      part="navigation"
              data-testid="${`${this.dataTestid}-Navigation`}"
          >
          <button @click=${this.handlePrev}
              data-testid="${`${this.dataTestid}-Button-Prev`}"
              >
            <slot name="icon-left-button"
              data-testid="${`${this.dataTestid}-Button-Left`}"
                  > &lt; </slot>
          </button>

          <button @click=${this.handleNext}
              data-testid="${`${this.dataTestid}-Button-Next`}"
              >
            <slot name="icon-right-button"
              data-testid="${`${this.dataTestid}-Button-NextIcon`}"
                  > &gt; </slot>
          </button>
        </div>

        <div class="years"
              data-testid="${`${this.dataTestid}`}"
          >
          ${this.fullYears.map(
            (year) =>
              html`<div
              data-testid="${`${this.dataTestid}-YearCell`}"
                class="year-cell ${this.isSelectedYear(year) ? "selected" : ""}
               ${this.isYearDisabled(Number(year)) && !this.isSelectedYear(year)
                  ? "disabled"
                  : ""}"
                @click=${() => {
                  if (!this.isYearDisabled(Number(year))) {
                    this.handleYearSelect(Number(year));
                  }
                }}
                part="year ${this.isYearDisabled(Number(year)) &&
                !this.isSelectedYear(year)
                  ? "disabled"
                  : ""}"
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
