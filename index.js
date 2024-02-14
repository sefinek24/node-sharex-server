require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const timeout = require('./middlewares/timeout.js');
const logger = require('./middlewares/morgan.js');
const limiter = require('./middlewares/ratelimit.js');
const { notFound, internalError } = require('./middlewares/other/errors.js');
const { version, description } = require('./package.json');

// Run express instance
const app = express();

// Set
app.set('trust proxy', 1);


// Use
app.use(helmet({ crossOriginEmbedderPolicy: false, crossOriginResourcePolicy: false }));
app.use(logger);
app.use(limiter);
app.use(timeout());
app.use(express.static('public'));


// Endpoints
app.get('/', (req, res) =>
	res.type('json').send(JSON.stringify({
		success: true,
		status: 200,
		message: description,
		version,
		worker: process.pid,
		contact: 'contact@sefinek.net',
		domains: {
			main: 'https://sefinek.net',
			api: 'https://api.sefinek.net',
			cdn: 'https://cdn.sefinek.net',
		},
	}, null, 3)),
);


// Errors
app.use(notFound);
app.use(internalError);

// Run server
app.listen(process.env.PORT, () => {
	if (process.env.NODE_ENV === 'production') {
		try {
			process.send('ready');
		} catch (err) {
			// . . .
		}
	}

	console.log(`Website https://screenshots.sefinek.net is running on http://127.0.0.1:${process.env.PORT}`);
});