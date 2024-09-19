const fs = require('node:fs');

const errorImages = {
	notFound: 'images/404.png',
	rateLimited: 'images/429.png',
	internalError: 'images/500.png'
};

const sendFile = (res, statusCode, filePath) => {
	res.writeHead(statusCode, { 'Content-Type': 'image/png' });
	const readStream = fs.createReadStream(filePath);
	readStream.pipe(res);
	readStream.on('error', () => {
		res.writeHead(500, { 'Content-Type': 'text/html' });
		res.end('<h1>File could not be read</h1>');
	});
};

exports.notFound = (req, res) => sendFile(res, 404, errorImages.notFound);

exports.rateLimited = (req, res) => sendFile(res, 429, errorImages.rateLimited);

exports.internalError = (err, req, res) => {
	sendFile(res, 500, errorImages.internalError);
	if (err) console.error(err);
};

exports.onTimeout = (req, res) => {
	res.writeHead(503, { 'Content-Type': 'text/html' });
	res.end('<h1>Timeout error</h1>');
};