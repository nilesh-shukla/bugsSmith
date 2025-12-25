import express from 'express';

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/analyze', authMiddleware, (req, res) => {
    res.json({
        message: 'Protected data accessed',
        user: req.user
    });
});

module.exports = router;