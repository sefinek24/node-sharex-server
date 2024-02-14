'use strict';

const fs = require('node:fs');
const path = require('node:path');

const mime = {
	'.png': 'image/png',
	'.ico': 'image/x-icon',
};

module.exports = (filename, pattern) => {
	filename = path.resolve(filename);
	pattern = pattern || /\/favicon\.(png|ico)$/;
	return (req, res, next) => {
		if (pattern.test(req.url)) {
			const ext = path.extname(filename);
			res.set('Content-Type', mime[ext]);
			fs.createReadStream(filename).pipe(res);
		} else {
			next();
		}
	};
};