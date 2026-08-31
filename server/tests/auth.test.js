const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

const ADMIN = { name: 'Test Admin', email: 'admin@test.com', password: 'TestPass123!', role: 'admin' };

async function createAdmin() {
  return User.create(ADMIN);
}

describe('Auth: cookie-based session', () => {
  it('login sets an httpOnly auth cookie and a readable CSRF cookie', async () => {
    await createAdmin();
    const res = await request(app).post('/api/auth/login').send({ email: ADMIN.email, password: ADMIN.password });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(ADMIN.email);

    const cookies = res.headers['set-cookie'].join(';');
    expect(cookies).toMatch(/token=/);
    expect(cookies).toMatch(/csrfToken=/);
    // The auth cookie itself must be httpOnly \u2014 the whole point of this
    // fix is that page JS can never read the session token.
    const tokenCookieLine = res.headers['set-cookie'].find((c) => c.startsWith('token='));
    expect(tokenCookieLine.toLowerCase()).toMatch(/httponly/);
  });

  it('rejects login with a wrong password', async () => {
    await createAdmin();
    const res = await request(app).post('/api/auth/login').send({ email: ADMIN.email, password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('/api/auth/me works using only the cookie, no Authorization header', async () => {
    await createAdmin();
    const agent = request.agent(app); // keeps cookies between requests, like a browser
    await agent.post('/api/auth/login').send({ email: ADMIN.email, password: ADMIN.password });

    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(ADMIN.email);
  });

  it('rejects a state-changing request that has the auth cookie but no CSRF header', async () => {
    await createAdmin();
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: ADMIN.email, password: ADMIN.password });

    // No X-CSRF-Token header attached \u2014 this simulates a forged
    // cross-site request that can rely on the browser auto-sending the
    // cookie, but can't read its value to also set the header.
    const res = await agent.put('/api/auth/change-password').send({ currentPassword: ADMIN.password, newPassword: 'NewPass123!' });
    expect(res.status).toBe(403);
  });

  it('logout clears the session so /me is rejected afterward', async () => {
    await createAdmin();
    const agent = request.agent(app);
    const loginRes = await agent.post('/api/auth/login').send({ email: ADMIN.email, password: ADMIN.password });
    const csrfCookie = loginRes.headers['set-cookie'].find((c) => c.startsWith('csrfToken='));
    const csrfToken = csrfCookie.split(';')[0].split('=')[1];

    await agent.post('/api/auth/logout').set('X-CSRF-Token', csrfToken);
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
