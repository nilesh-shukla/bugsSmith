const tokenService = require('./token.service');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ ok: false, error: 'Missing Authorization' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = tokenService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Invalid token' });
  }
};
