import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { format, subMonths, addMonths } from "date-fns";
import { LocaleUtils } from "./locale-utils";

@customElement("col-cal-header")
export class ColCalHeader extends LitElement {
  static styles = css`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
    }
    .week {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      padding: 0.5rem 0;
    }
    .day-header {
      font-weight: bold;
    }
    .nav-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0 0.5rem;
    }
  `;
  @property({ type: String }) locale: string = "en-US";
  @property({ type: Object }) date: Date = new Date();

  @state()
  private _date: Date = this.date;

  handleChangeMonth() {
    this.dispatchEvent(
      new CustomEvent("change-month", {
        detail: this._date,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="header" part="header">
        <div>
          <slot name="header-date">
            ${format(this._date, "MMMM yyyy", {
              locale: new LocaleUtils(this.locale).currentLocale(),
            })}
          </slot>
        </div>
        <div>
          <button
            part="left-button"
            class="nav-button"
            @click=${() => {
              this._date = subMonths(this._date, 1);
              this.handleChangeMonth();
            }}
          >
            <slot name="icon-left-button"> &lt; </slot>
          </button>
          <button
            class="nav-button"
            part="right-button"
            @click=${() => {
              this._date = addMonths(this._date, 1);
              this.handleChangeMonth();
            }}
          >
            <slot name="icon-right-button"> &gt; </slot>
          </button>
        </div>
      </div>

      <div class="week">
        ${["П", "В", "С", "Ч", "П", "С", "В"].map(
          (day) => html`<div class="day-header">${day}</div>`,
        )}
      </div>
    `;
  }
}
