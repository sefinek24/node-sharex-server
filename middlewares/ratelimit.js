const { rateLimited } = require('../middlewares/other/errors.js');

const rateLimitMap = new Map();
const WINDOW_MS = 5 * 60 * 1000;
const LIMIT = 12;

module.exports = (req, res, next) => {
	if (process.env.NODE_ENV === 'development') return next();

	const currentTime = Date.now();
	const ip = req.clientRealIP;

	const entry = rateLimitMap.get(ip) || { count: 0, startTime: currentTime };
	if (currentTime - entry.startTime > WINDOW_MS) {
		entry.count = 1;
		entry.startTime = currentTime;
	} else {
		entry.count++;
		if (entry.count > LIMIT) return rateLimited(req, res);
	}

	rateLimitMap.set(ip, entry);
	next();
};