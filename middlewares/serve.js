const fs = require('node:fs');
const path = require('node:path');
const mime = require('mime-types');
const { internalError, notFound } = require('../middlewares/other/errors.js');

const CACHE_DURATION = 20 * 24 * 60 * 60; // 20 days

const serveFile = (filePath, res, stats) => {
	const mimeType = mime.lookup(filePath) || 'application/octet-stream';

	res.writeHead(200, {
		'Content-Type': mimeType,
		'Content-Length': stats.size,
		'Last-Modified': stats.mtime.toUTCString(),
		'Cache-Control': `public, max-age=${CACHE_DURATION}`
	});

	fs.createReadStream(filePath)
		.on('error', err => internalError(err, {}, res))
		.pipe(res);
};

const servePaths = {
	'default': 'public'
};

const serveStaticFiles = async (req, res) => {
	try {
		const cleanUrl = req.url.split('?')[0];
		const basePath = Object.keys(servePaths).find(p => cleanUrl.startsWith(p)) || 'default';
		const relativeUrl = basePath === 'default' ? cleanUrl : cleanUrl.slice(basePath.length);
		const filePath = path.join(servePaths[basePath], relativeUrl);

		const stats = await fs.promises.stat(filePath);
		if (!stats.isFile()) return notFound(req, res);

		const ifModifiedSince = req.headers['if-modified-since'];
		if (ifModifiedSince && new Date(ifModifiedSince) >= stats.mtime) {
			res.writeHead(304);
			return res.end();
		}

		serveFile(filePath, res, stats);
	} catch {
		notFound(req, res);
	}
};

module.exports = serveStaticFiles;