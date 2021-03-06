import * as R from 'ramda';

const CACHE_SELECTOR_KEY = 'data-cached-slot-selector';

const wrapWithHTMLSkel = (code, headTags = '') => `
  <html>
    <head>
      <title>AD PREVIEW</title>
      <meta charset="UTF-8" />
      <style>
        body, html {
          margin: 0;
          padding: 0;
        }
      </style>
      ${headTags}
    </head>

    <body>
      ${code}
    </body>
  </html>
`;

/**
 * @param {string}  tag
 * @param {object}  string
 */
const createElement = (tag, styles, attributes) => {
  const frame = document.createElement(tag);
  if (styles)
    Object.assign(frame.style, styles);

  if (attributes) {
    R.forEachObjIndexed(
      (attribute, key) => frame.setAttribute(key, attribute),
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
const replaceAdSlot = (selector, code, styles = {}) => {
  const element = selector instanceof Element
    ? selector
    : searchSlot(selector);

  if (!element)
    return false;

  const {parentNode: parent} = element;
  if (!parent)
    return null;

  let frame = parent.querySelector('[data-ad-preview]');
  const cached = !!frame;
  if (!frame) {
    frame = createElement(
      'iframe',
      {
        ...(styles || {}),
        width: `${element.offsetWidth}px`,
        height: `${element.offsetHeight}px`,
        margin: 0,
        border: '1px dashed rgba(0, 0, 0, 0.45)',
      },
      {
        'data-ad-preview': true,
        ...R.is(String, selector) && {
          [CACHE_SELECTOR_KEY]: selector,
        },
      },
    );
  }

  frame.srcdoc = wrapWithHTMLSkel(
    code,
    `
      <style>
        html, body {
          overflow: hidden;
          width: ${element.offsetWidth}px;
          height: ${element.offsetHeight}px;
        }
      </style>
    `,
  );

  if (!cached) {
    parent.appendChild(frame);
    parent.removeChild(element);
  }

  return frame;
};

export default replaceAdSlot;
