module.exports = req => {
	const xForwardedFor = req.headers['x-forwarded-for'];
	return xForwardedFor ? xForwardedFor.split(',')[0].trim() : req.socket.remoteAddress;
};