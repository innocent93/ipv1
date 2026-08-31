const crypto = require('crypto');

const isProd = process.env.NODE_ENV === 'production';

// Client/admin and server are typically deployed on entirely different
// domains (e.g. Vercel for the frontends, Render/Railway for the API) \u2014
// not just different subdomains of one site. Browsers treat that as
// cross-site, and cross-site fetch() calls only carry cookies when
// SameSite=None (Lax/Strict cookies are silently dropped on cross-site
// XHR/fetch, even with credentials:'include' on the client). SameSite=None
// requires Secure, which is fine since both Vercel and Render/Railway
// serve over HTTPS. In dev, 'lax' is used since localhost:5173 talking to
// localhost:5000 counts as same-site (SameSite ignores port).
const AUTH_COOKIE_OPTS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days, matches JWT_EXPIRE default
};

// The CSRF cookie is deliberately NOT httpOnly \u2014 the frontend needs to
// read it in JS and echo it back as a header. This is the standard
// "double-submit cookie" pattern: an attacker's cross-site form can make
// the browser send the cookie automatically, but can't read its value to
// also set the matching header, so a mismatched/missing header blocks
// forged requests.
const CSRF_COOKIE_OPTS = {
  httpOnly: false,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

exports.setAuthCookies = (res, token) => {
  res.cookie('token', token, AUTH_COOKIE_OPTS);
  const csrfToken = crypto.randomBytes(32).toString('hex');
  res.cookie('csrfToken', csrfToken, CSRF_COOKIE_OPTS);
  return csrfToken;
};

exports.clearAuthCookies = (res) => {
  res.clearCookie('token', { path: '/' });
  res.clearCookie('csrfToken', { path: '/' });
};
