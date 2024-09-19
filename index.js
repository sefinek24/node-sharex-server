require('dotenv').config();

const http = require('node:http');
const cors = require('cors');
const helmet = require('helmet');
const ratelimit = require('./middlewares/ratelimit.js');
const timeout = require('./middlewares/timeout.js');
const morgan = require('./middlewares/morgan.js');
const { internalError } = require('./middlewares/other/errors.js');
const serveStaticFiles = require('./middlewares/serve.js');
const { version, description } = require('./package.json');

const middlewares = [cors(), helmet(), morgan, ratelimit, timeout()];

const applyMiddlewares = async (req, res) => {
	try {
		for (const middleware of middlewares) {
			await new Promise((resolve, reject) => middleware(req, res, err => (err ? reject(err) : resolve())));
		}
	} catch (err) {
		internalError(err, req, res);
		return false;
	}
	return true;
};

const server = http.createServer(async (req, res) => {
	const middlewaresApplied = await applyMiddlewares(req, res);
	if (!middlewaresApplied) return;

	try {
		if (req.url === '/') {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({
				success: true,
				status: 200,
				message: description,
				version,
				github: 'https://github.com/sefinek24/node-sharex-server'
			}, null, 3));
		} else {
			await serveStaticFiles(req, res);
		}
	} catch (err) {
		internalError(err, req, res);
	}
});

server.listen(process.env.PORT, () => {
	if (process.env.NODE_ENV === 'production') {
		try {
			process.send('ready');
		} catch (err) {
			console.log('Failed to send ready signal to parent process.', err.message);
		}
	} else {
		console.log(`Server running at http://127.0.0.1:${process.env.PORT}`);
	}
});