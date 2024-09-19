const morgan = require('morgan');

module.exports = morgan('[:status :method :response-time ms] :url :user-agent :remote-addr ":referrer"');