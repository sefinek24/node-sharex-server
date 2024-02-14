const morgan = require('morgan');

const userAgents = new Set([
	'Better Uptime Bot Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
]);

const skipUserAgent = req => userAgents.has(req.headers['user-agent']);

const normalizeBody = ({ body }) => {
	if (!(body && typeof body === 'object' && Object.keys(body).length)) return null;

	return JSON.stringify(body);
};

morgan.token('body', normalizeBody);

module.exports = morgan('[:status :method :response-time ms] :url :user-agent ":referrer" :body', { skip: skipUserAgent });