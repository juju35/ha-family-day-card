// ---------------------------------------------------------------------------
// Interaction helpers
// ---------------------------------------------------------------------------

// Element names of Home Assistant dialogs (more-info opened from the card, among others).
export const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
export const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n.tagName));
};

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS a tap on something that is not
// clickable sends no click to the page. It counts when the press and the release are both outside the card; a scroll
// does not count (the browser cancels the pointer). Keyboard clicks still go through the click event.
export const watchOutside = (card, handler) => {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOutside(card, ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOutside(card, ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOutside(card, ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("click", onClick, true);
    },
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    },
  };
};

// Brings `from`'s children in line with `to`'s, position by position: nodes of the same kind are kept and updated
// (text, attributes, then their own children), the others replaced, added or removed. The animations of the pictures
// go on across updates, and a changed class starts the animations it names.
export const morph = (from, to) => {
  const a = [...from.childNodes];
  const b = [...to.childNodes];
  b.forEach((nb, i) => {
    const na = a[i];
    if (!na) from.appendChild(nb);
    else if (na.nodeType !== nb.nodeType || na.nodeName !== nb.nodeName) from.replaceChild(nb, na);
    else if (nb.nodeType !== 1) {
      if (na.nodeValue !== nb.nodeValue) na.nodeValue = nb.nodeValue;
    } else {
      for (const at of [...na.attributes]) if (!nb.hasAttribute(at.name)) na.removeAttribute(at.name);
      for (const at of [...nb.attributes]) if (na.getAttribute(at.name) !== at.value) na.setAttribute(at.name, at.value);
      morph(na, nb);
    }
  });
  for (let i = a.length - 1; i >= b.length; i--) from.removeChild(a[i]);
};

// No rewrite of the card between a press and its click: an update under the pointer would replace the element
// pressed. While a press is in progress a render is left pending, done at the click or right after the release.
export const holdUnderPress = (card, render) => {
  const root = card.shadowRoot;
  card._onPressEnd = () => {
    window.removeEventListener?.("pointerup", card._onPressEnd, true);
    window.removeEventListener?.("pointercancel", card._onPressEnd, true);
    setTimeout(() => card._endPress(), 0);
  };
  card._endPress = () => {
    card._pressing = false;
    if (!card._dirty) return;
    card._dirty = false;
    render();
  };
  card._dropPress = () => {
    card._pressing = false;
    card._dirty = false;
    window.removeEventListener?.("pointerup", card._onPressEnd, true);
    window.removeEventListener?.("pointercancel", card._onPressEnd, true);
  };
  root.addEventListener?.("pointerdown", () => {
    card._pressing = true;
    window.addEventListener?.("pointerup", card._onPressEnd, true);
    window.addEventListener?.("pointercancel", card._onPressEnd, true);
  });
  root.addEventListener?.(
    "click",
    () => {
      card._pressing = false;
    },
    true,
  );
};

export const sameDeps = (a, b) => !!a && a.length === b.length && a.every((d, i) => d === b[i]);
