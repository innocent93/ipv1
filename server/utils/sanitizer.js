const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Strict config for user-generated content
const strictConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote'],
  ALLOWED_ATTR: ['href', 'title', 'target'],
  ALLOW_DATA_ATTR: false,
  FORBID_ATTR: ['style', 'onclick', 'onerror', 'onload'],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
};

// Relaxed config for admin-controlled content (blog posts, services)
const relaxedConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'td', 'th'],
  ALLOWED_ATTR: ['href', 'title', 'target', 'src', 'alt', 'width', 'height', 'class'],
  ALLOW_DATA_ATTR: false,
  FORBID_ATTR: ['style', 'onclick', 'onerror', 'onload'],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input'],
};

exports.sanitizeStrict = (dirty) => DOMPurify.sanitize(dirty, strictConfig);
exports.sanitizeRelaxed = (dirty) => DOMPurify.sanitize(dirty, relaxedConfig);
exports.sanitizePlainText = (dirty) => DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
