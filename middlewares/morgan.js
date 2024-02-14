const morgan = require('morgan');

morgan.token('body', req => JSON.stringify(req.body));

module.exports = morgan('[:status :method :response-time ms] :url :user-agent ":referrer" :body');