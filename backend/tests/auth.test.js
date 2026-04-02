(async () => {
  // Basic auth smoke tests without external test runner
  const fetch = global.fetch || (await import('node-fetch')).default;
  const base = process.env.API_URL || 'http://localhost:4000';

  function ok(condition, msg) {
    if (!condition) { console.error('FAIL:', msg); process.exitCode = 2; } else console.log('OK:', msg);
  }

  try {
    console.log('Signup test...');
    let res = await fetch(base + '/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'TestRun', email: 'testrun+test@example.com', password: 'pass123', role: 'viewer' }) });
    ok(res.status === 201, '/auth/signup returned 201');
    const signup = await res.json();
    ok(signup.ok === true && signup.user, 'signup payload ok');

    console.log('Login test...');
    res = await fetch(base + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'testrun+test@example.com', password: 'pass123' }), redirect: 'manual' });
    ok(res.status === 200, '/auth/login returned 200');
    const login = await res.json();
    ok(login.accessToken && login.user, 'login returned token and user');

    console.log('Access protected route...');
    res = await fetch(base + '/auth/me', { headers: { Authorization: 'Bearer ' + login.accessToken } });
    ok(res.status === 200, '/auth/me accessible with token');

    console.log('Done.');
  } catch (e) {
    console.error('Error running tests', e);
    process.exit(1);
  }
})();
