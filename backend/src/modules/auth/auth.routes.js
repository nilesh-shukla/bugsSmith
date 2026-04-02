const express = require('express');
const router = express.Router();

const controller = require('./auth.controller');
const authMiddleware = require('./auth.middleware');
const { allowRoles } = require('../../middleware/roles.middleware');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', authMiddleware, controller.me);

// Example protected route
router.get('/admin-only', authMiddleware, allowRoles('admin'), (req, res) => {
	res.json({ ok: true, message: 'admin content' });
});

module.exports = router;
