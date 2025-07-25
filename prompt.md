## Prompt: Lit Calendar Component

**Goal:**  Develop a reusable Lit component for displaying a calendar. The component should be highly configurable and easily stylable.

**Component Name:** `lit-calendar`

**Inputs (Properties):**

*   `view`: `string` (default: `'month'`).  Possible values: `'month'`, `'week'`, `'day'`.  Determines the initial calendar view.
*   `date`: `Date` (default: `new Date()`). The date currently being displayed.  The component should allow navigation to different months/weeks/days.
*   `locale`: `string` (default: `navigator.language`).  The locale for date formatting and weekday/month names.
*   `firstDayOfWeek`: `number` (default: `1` - Monday).  Determines the first day of the week (0-6, where 0 is Sunday, 1 is Monday, etc.).
*   `disabledDates`: `Date[]` (default: `[]`).  An array of dates that should be visually disabled (e.g., not selectable).
*   `selectedDate`: `Date | null` (default: `null`). The currently selected date.
*   `showWeekNumbers`: `boolean` (default: `false`). Whether to display week numbers.
*   `events`: `Object[]` (default: `[]`). An array of event objects, each with a `date` (Date) and `title` (string) property. These should be displayed on the calendar.

**Outputs (Events):**

*   `date-change`:  Dispatched when the displayed `date` changes (e.g., user navigates to a different month).  Detail: `Date` (the new date).
*   `selected-date-change`: Dispatched when the `selectedDate` changes (e.g., user clicks on a date). Detail: `Date | null` (the new selected date).

**Functionality:**

*   **Rendering:** The component should render the calendar based on the `view` and `date` properties.
*   **Navigation:**  Provide controls (e.g., arrows) to navigate to the next/previous month, week, or day.
*   **Date Selection:**  Allow users to select dates (unless disabled).
*   **Event Display:** Display events on the calendar, visually indicating dates with events.  Consider using tooltips or other visual cues to show event titles.
*   **Accessibility:**  Ensure the component is accessible, including keyboard navigation and screen reader compatibility. Use appropriate ARIA attributes.
*   **Styling:**  The component should be easily stylable using CSS variables (custom properties). Provide a set of default styles, but allow users to override them.

**Design Considerations:**

*   **Lit Element:**  The component *must* be a Lit Element, utilizing Lit's reactive properties and template literals.
*   **Shadow DOM:**  Use Shadow DOM for encapsulation.
*   **TypeScript:**  Use TypeScript for type safety.
*   **Testing:**  Write unit tests using a testing framework like Vitest or Jest with @testing-library/lit-element.
*   **Modularity:**  Break down the component into smaller, reusable parts (e.g., a separate component for rendering a single month view).
*   **Date Handling:** Use a reliable date library like `date-fns` or `Luxon` for date manipulation and formatting.  Avoid using the native `Date` object directly for complex operations.

**Example Usage:**

```html
<lit-calendar view="month" date="2024-01-15" locale="en-US" @date-change="${(e) => console.log(e.detail)}"></lit-calendar>
