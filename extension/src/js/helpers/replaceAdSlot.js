import * as R from 'ramda';

const CACHE_SELECTOR_KEY = 'data-cached-slot-selector';

/**
 * @param {string}  tag
 * @param {object}  string
 */
const createElement = (tag, styles, attributes) => {
  const frame = document.createElement(tag);
  if (styles)
    Object.assign(frame.style, styles);

  if (attributes) {
    R.forEach(
      (key, attribute) => frame.setAttribute(key, attribute),
      attributes,
    );
  }
  return frame;
};

/**
 * Searchs DOM for ad slot selector, search also already loaded slots
 *
 * @param {string}  selector
 */
const searchSlot = selector => (
  document.querySelector(selector)
    || document.querySelector(`[${CACHE_SELECTOR_KEY}="${selector}"]`)
);

/**
 * Replaces current ad slot iframe with
 * iframe with test code ad. It will be better
 * to replace DIV with new element to prevent
 * bugs in already attached scripts
 *
 * @param {string}  selector
 * @param {string}  code
 * @param {object}  styles
 */
const replaceAdSlot = (selector, code, styles) => {
  const element = searchSlot(selector);
  if (!element)
    return false;

  const {parentNode: parent} = element;
  if (!parent)
    return false;

  const frame = createElement(
    'iframe',
    {
      ...(styles || {}),
      width: `${element.offsetWidth}px`,
      height: `${element.offsetHeight}px`,
      border: 0,
      margin: 0,
    },
    {
      srcdoc: code,
      [CACHE_SELECTOR_KEY]: selector,
    },
  );

  parent.removeChild(element);
  parent.appendChild(frame);

  return true;
};

export default replaceAdSlot;