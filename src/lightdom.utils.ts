/**
 * Inserts child elements into container elements based on the `slot` attribute.
 * Elements with `slot="name"` are moved into `<div slot="name">`.
 *
 * @param container - The DOM element (e.g., `this` or `this.shadowRoot`)
 * @throws {Error} If the container is not a valid Element
 */
export const insertSlotsByName = (container: Element | null): void => {
  if (!container || !(container instanceof Element)) {
    console.warn("insertSlotsBySlot: container is not a valid DOM element");
    return;
  }

  const slotElements = Array.from(container.children).filter(
    (el): el is HTMLElement =>
      el.hasAttribute("slot") && el.getAttribute("slot")?.trim() !== "",
  );

  const slotsMap = new Map<string, HTMLElement[]>();

  slotElements.forEach((el) => {
    const slotName = el.getAttribute("slot")!;
    if (!slotsMap.has(slotName)) {
      slotsMap.set(slotName, []);
    }
    slotsMap.get(slotName)!.push(el);
  });

  for (const [slotName, elements] of slotsMap) {
    const targetSelector = `[name="${slotName}"]`;

    let target = container.querySelector<HTMLElement>(targetSelector);

    if (!target && "shadowRoot" in container && container.shadowRoot) {
      target = container.shadowRoot.querySelector<HTMLElement>(targetSelector);
    }

    if (!target) continue;

    target.innerHTML = "";

    elements.forEach((el) => {
      target.appendChild(el);
    });
  }
};
