const path = require('node:path');

const notFoundImg = path.join(__dirname, '..', '..', 'images', '404.png');
const rateLimitedImg = path.join(__dirname, '..', '..', 'images', '429.png');
const internalErrorImg = path.join(__dirname, '..', '..', 'images', '500.png');

exports.notFound = (req, res) => {
	res.status(404).sendFile(notFoundImg);
};

exports.rateLimited = (req, res, next, options) => {
	res.status(options.statusCode).sendFile(rateLimitedImg);
};

exports.internalError = (err, req, res, next) => {
	res.status(500).sendFile(internalErrorImg);

	if (err) console.error(err);
	return next;
};

exports.onTimeout = (req, res) => {
	res.status(503).send('<h1>Timeout error</h1>');
};