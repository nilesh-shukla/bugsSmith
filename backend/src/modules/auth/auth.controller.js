const authService = require('./auth.service');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await authService.createUser({ name, email, password, role });
    res.status(201).json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ ok: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.authenticateUser({ email, password });
    // send refresh token as httpOnly cookie
    const cookieSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', data.refreshToken, { httpOnly: true, secure: cookieSecure, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ ok: true, user: data.user, accessToken: data.accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ ok: false, error: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) throw new Error('Missing refresh token');
    const data = await authService.refreshAccessToken(refreshToken);
    res.json({ ok: true, accessToken: data.accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ ok: false, error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (refreshToken) await authService.revokeRefreshToken(refreshToken);
    res.clearCookie('refreshToken');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ ok: false, error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);
    res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ ok: false, error: err.message });
  }
};
