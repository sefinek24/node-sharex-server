const fs = require('node:fs');

const images = {
	notFound: 'images/404.png',
	rateLimited: 'images/429.png',
	internalError: 'images/500.png',
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

exports.notFound = (req, res) => sendFile(res, 404, images.notFound);

exports.rateLimited = (req, res) => sendFile(res, 429, images.rateLimited);

exports.internalError = (err, req, res) => {
	sendFile(res, 500, images.internalError);
	if (err) console.error(err);
};

exports.onTimeout = (req, res) => sendFile(res, 503, images.timeout);