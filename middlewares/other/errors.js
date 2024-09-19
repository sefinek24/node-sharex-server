const fs = require('node:fs');

const images = {
	notFound: 'images/404.png',
	ratelimit: 'images/429.png',
	internal: 'images/500.png',
	timeout: 'images/503.png'
};

const sendFile = (res, statusCode, filePath) => {
	const readStream = fs.createReadStream(filePath);
	res.writeHead(statusCode, { 'Content-Type': 'image/png' });
	readStream.pipe(res).on('error', () => {
		res.writeHead(500, { 'Content-Type': 'text/html' });
		res.end('<h1>File could not be read</h1>');
	});
};

exports.notFound = (_, res) => sendFile(res, 404, images.notFound);

exports.rateLimited = (_, res) => sendFile(res, 429, images.ratelimit);

exports.internalError = (err, _, res) => {
	sendFile(res, 500, images.internal);
	if (err) console.error(err);
};

exports.onTimeout = (_, res) => sendFile(res, 503, images.timeout);