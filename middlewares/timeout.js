const { onTimeout } = require('./other/errors.js');
const TIMEOUT = 7000;

module.exports = (req, res, next) => {
	const timer = setTimeout(() => onTimeout(req, res), TIMEOUT);

	const cleanUp = () => clearTimeout(timer);

	res.on('close', cleanUp);
	res.on('finish', cleanUp);

	next();
};