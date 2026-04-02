function allowRoles(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ ok: false, error: 'Unauthorized' });
    if (!roles.includes(user.role)) return res.status(403).json({ ok: false, error: 'Forbidden' });
    next();
  };
}

module.exports = { allowRoles };
