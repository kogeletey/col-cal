import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { format, subMonths, addMonths } from "date-fns";
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
        <slot class="header__date" name="header-date" part="header-date">
          ${format(this._date, "MMMM yyyy", {
            locale: new LocaleUtils(this.locale).currentLocale(),
          })}
        </slot>
        <div class="header__buttons">
          <button
            part="left-button"
            class="left-button"
            @click=${() => {
              this._date = subMonths(this._date, 1);
              this.handleChangeMonth();
            }}
          >
            <slot name="icon-left-button"> &lt; </slot>
          </button>
          <button
            class="right-button"
            part="right-button"
            @click=${() => {
              this._date = addMonths(this._date, 1);
              this.handleChangeMonth();
            }}
          >
            <!-- :disabled="this.maxDate > this._date" -->
            <slot name="icon-right-button"> &gt; </slot>
          </button>
        </div>
      </div>

      <div class="week">
        ${["П", "В", "С", "Ч", "П", "С", "В"].map(
          (day) => html`<span class="day-header">${day}</span>`,
        )}
      </div>
    `;
  }
}
