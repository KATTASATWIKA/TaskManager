const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models.js/User');


router.post('/register', async (req,res) => {
const { name, email, password } = req.body;
const exists = await User.findOne({ email });
if (exists) return res.status(409).json({ message: 'Email already in use' });
const passwordHash = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, passwordHash });
const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const isProd = process.env.NODE_ENV === 'production';
res.cookie('accessToken', token, { httpOnly: true, sameSite: isProd ? 'strict' : 'lax', secure: isProd, maxAge: 7*24*60*60*1000 });
res.status(201).json({ id: user._id, email: user.email, name: user.name });
});


router.post('/login', async (req,res) => {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const ok = await user.verifyPassword(password);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const isProd = process.env.NODE_ENV === 'production';
res.cookie('accessToken', token, { httpOnly: true, sameSite: isProd ? 'strict' : 'lax', secure: isProd, maxAge: 7*24*60*60*1000 });
res.json({ id: user._id, email: user.email, name: user.name });
});


router.get('/me', async (req,res) => {
const token = req.cookies?.accessToken;
if (!token) return res.status(401).json({ message: 'No token provided' });
try {
const { sub } = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(sub).select('name email');
if (!user) return res.status(401).json({ message: 'User not found' });
res.json(user);
} catch (error) {
res.status(401).json({ message: 'Invalid token' });
}
});


router.post('/logout', (req,res) => {
res.clearCookie('accessToken');
res.status(204).end();
});


module.exports = router;