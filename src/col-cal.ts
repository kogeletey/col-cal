import { LitElement, html, css } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import "@awesome.me/webawesome/dist/components/popup/popup.js";
import "./col-cal-header";
import "./col-cal-dates";
import "./col-cal-months";
import "./col-cal-years";

@customElement("col-cal")
export class ColCal extends LitElement {
  @property({ type: Date }) date: Date = new Date();
  @property({ type: String }) locale: string = "en-US";
  @property({ type: Number }) firstDayOfWeek: number = 1;
  @property({ type: Array }) disabledDates: Date[] = [];
  @property({ type: Object }) selectedDate: Date | null = null;
  @property({ type: Array }) events: Array<{ date: Date; title: string }> = [];

  @state()
  private _date: Date = this.date;
  private _month: Date = this.date;
  @state() private showMonthsPopup: boolean = false;
  @state() private showYearsPopup: boolean = false;
  @state() private selectedMonth: string = "";
  @state() private selectedYear: string = "";

  static styles = css`
    :host {
      --calendar-bg: #ffffff;
      --calendar-border: #e0e0e0;
      --calendar-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: inline-block;
    }

    .calendar {
      background: var(--calendar-bg);
      border: 1px solid var(--calendar-border);
      border-radius: 8px;
      box-shadow: var(--calendar-shadow);
      overflow: hidden;
      font-family: Arial, sans-serif;
      position: relative;
    }

    wa-popup {
      --popup-background: var(--calendar-bg);
      --popup-border: var(--calendar-border);
      --popup-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      --popup-border-radius: 8px;
    }
  `;

  private get currentLocale(): "en" | "ru" {
    return this.locale.startsWith("ru") ? "ru" : "en";
  }

  private handleDateSelected(e: CustomEvent) {
    this.selectedDate = e.detail;
    this.dispatchEvent(
      new CustomEvent("date-selected", {
        detail: this.selectedDate,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private toggleMonthsPopup() {
    this.showMonthsPopup = !this.showMonthsPopup;
    this.showYearsPopup = false;
  }

  private toggleYearsPopup() {
    this.showYearsPopup = !this.showYearsPopup;
    this.showMonthsPopup = false;
  }

  private closePopups() {
    this.showMonthsPopup = false;
    this.showYearsPopup = false;
  }

  private handleMonthSelected(e: CustomEvent) {
    const monthName = e.detail.month;
    const monthIndex = this.getMonthIndex(monthName);
    const newDate = new Date(this._date.getFullYear(), monthIndex, 1);
    this._date = newDate;
    this.closePopups();
  }

  private handleYearSelected(e: CustomEvent) {
    const year = parseInt(e.detail.year);
    const newDate = new Date(year, this._date.getMonth(), 1);
    this._date = newDate;
    this.closePopups();
  }

  private getMonthIndex(monthName: string): number {
    const months =
      this.currentLocale === "ru"
        ? [
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
          ]
        : [
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
          ];

    return months.indexOf(monthName);
  }

  private formatMonthYear(date: Date): string {
    const monthNames =
      this.currentLocale === "ru"
        ? [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
          ]
        : [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];

    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  }

  render() {
    return html`
      <div class="calendar">
        <col-cal-header
          .date=${this._date}
          .locale=${this.locale}
          @change-month=${({ detail }: { detail: Date }) => {
            this._month = detail as Date;
          }}
          @click-month=${this.toggleMonthsPopup}
          @click-year=${this.toggleYearsPopup}
        >
        </col-cal-header>

        <col-cal-dates
          .date=${this._date}
          .month=${this._month}
          locale=${this.locale}
          .firstDayOfWeek=${this.firstDayOfWeek}
          .disabledDates=${this.disabledDates}
          .selectedDate=${this.selectedDate}
          .events=${this.events}
          @date-selected=${this.handleDateSelected}
        ></col-cal-dates>

        <wa-popup active=${this.showMonthsPopup} position="top">
          <col-cal-months
            slot="content"
            .selectedMonth=${this.selectedMonth}
            locale=${this.currentLocale}
            @month-selected=${this.handleMonthSelected}
          ></col-cal-months>
        </wa-popup>

        <!--
        <wa-popup
          .open=${this.showYearsPopup}
          position="bottom-start"
          @close=${this.closePopups}
        >
          <col-cal-years
            slot="content"
            .selectedYear=${this.selectedYear}
            .language=${this.currentLocale}
            @year-selected=${this.handleYearSelected}
          ></col-cal-years>
        </wa-popup>
        -->
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "col-cal": ColCal;
  }
}
