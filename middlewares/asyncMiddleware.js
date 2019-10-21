// Async Middleware
// http://www.acuriousanimal.com/2018/02/15/express-async-middleware.html

const asyncMiddleware = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = asyncMiddleware
