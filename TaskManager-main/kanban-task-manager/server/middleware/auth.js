const jwt = require('jsonwebtoken');


module.exports = function auth(req, res, next) {
const token = req.cookies?.accessToken;
if (!token) return res.status(401).json({ message: 'Not authenticated' });
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.userId = payload.sub;
next();
} catch (e) {
return res.status(401).json({ message: 'Invalid token' });
}
};