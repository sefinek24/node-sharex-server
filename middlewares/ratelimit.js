const rateLimit = require('express-rate-limit');
const { rateLimited } = require('../middlewares/other/errors.js');

module.exports = rateLimit({
	windowMs: 5 * 60 * 1000,
	limit: 500,
	standardHeaders: 'draft-7',
	legacyHeaders: false,

	skip: req => req.ip === '::ffff:127.0.0.1',

	handler: rateLimited,
});