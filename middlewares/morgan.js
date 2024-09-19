const morgan = require('morgan');

morgan.token('real-ip', req => req.clientRealIP || req.socket.remoteAddress);

module.exports = morgan('[:status :method :response-time ms] :url :user-agent :real-ip ":referrer"');